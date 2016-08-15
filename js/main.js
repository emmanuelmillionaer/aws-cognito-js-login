var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

var WindowHelper = {
    windowIds: ['register', 'mfa_confirmation', 'login', 'logged_in'],

    hideAll: () => {
        $.each(WindowHelper.windowIds, (idx, windowId) => {
            $('#' + windowId).hide();
        });
    },

    show: (windowId) => {
        WindowHelper.hideAll();
        $('#' + windowId).show();
    }
}


var FormHelper = {
    fillForm: (formId, attributes) => {
        var form = $("#" + formId);
        form.html('');

        $.each(attributes, (idx, attribute) => {
            form.append(
                $('<label/>', {html: attribute + ":</br>", for: attribute}).append(
                    $('<input/>', {name: attribute})
                )
            )
        });
    },

    getNameValuePairs: (formId) => {
        return $("#" + formId + " input").map((idx, input) => {
           return { Name: $(input).attr('name'), Value: $(input).val() }
        });
    }
}

var Register = function(){

    this.init = () => {
        WindowHelper.show('register');
        FormHelper.fillForm('register_form', userAttributes);

        $('#signUpBtn').click(function(){
            var nameValuePairs = FormHelper.getNameValuePairs('register_form');
            var attributeList = $.map(nameValuePairs, (nameValuePair, idx) => { return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(nameValuePair) })

            var userName = $('#username_input').val();
            var userPassword = $('#password_input').val();

            this.signUp(userName, userPassword, attributeList);
        }.bind(this));
    };

    this.signUp = (userName, userPassword, attributeList) => {
        userPool.signUp(userName, userPassword, attributeList, null, function(err, result){
            if (err) {
                alert(err);
                return;
            }
            cognitoUser = result.user;

            if(MFARequired){ new MFAConfirmation(cognitoUser) };
        }.bind(this));
    };

    this.init();
};

var MFAConfirmation = function(cognitoUser, method) {

    this.init = () => {
        WindowHelper.show('mfa_confirmation');
        $('#mfa_confirmation #user_name').text(cognitoUser.getUsername());
        $('#confirmBtn').click(function(){
            var code = $('#confirmation_input').val();

            if(method == 'login'){
                this.sendLoginCode(code);
            }else{
                this.confirm(code);
            };
        }.bind(this));
    };

    this.confirm = (confirmationCode) => {
        cognitoUser.confirmRegistration(confirmationCode, true, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            new Login();
        }.bind(this));
    };

    this.sendLoginCode = (mfaCode) => {
        cognitoUser.sendMFACode(mfaCode, {
            onSuccess: function (result) {
                new LoggedIn(cognitoUser, result);
            },
            onFailure: function(err) {
                alert(err);
            }
        });
    }

    this.init();
}

var Login = function(opt){
    this.init = () => {
        if(opt && opt.refresh == true){
            this.showLoginForm();
        }else{
            var cognitoUser = userPool.getCurrentUser();

            if (cognitoUser != null) {
                cognitoUser.getSession(function(err, session) {
                    if (err) {
                       alert(err);
                       this.showLoginForm();
                    }else if(session.isValid()){
                        new LoggedIn(cognitoUser, session);
                    }else{
                        this.showLoginForm();
                    }
                }.bind(this));
            }else{
                this.showLoginForm();
            }
        }
    };

    this.showLoginForm = () => {
        WindowHelper.show('login');

        $('#loginBtn').click(function(){
            var userName = $('#login #username_input').val();
            var userPassword = $('#login #password_input').val();

            this.authenticate(userName, userPassword);
        }.bind(this));
    };

    this.authenticate = (userName, userPassword) => {
        var userData = {Username: userName, Pool : userPool}
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        var authenticationData = {Username : userName, Password : userPassword};
        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                LoggedIn(cognitoUser, result);
            },

            mfaRequired: function(session){
                new MFAConfirmation(cognitoUser, 'login');
            },

            onFailure: function(err) {
                alert(err);
            },

        });
    };

    this.init();
}

var AWSInitialize = function(token){
    Logins = {};
    Logins['cognito-idp.' + AWSCognito.config.region + '.amazonaws.com/' + poolData.UserPoolId] = token;

    AWS.config.region = AWSCognito.config.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : identityPoolId,
        region: AWSCognito.config.region,
        Logins : Logins
    });
}

var LoggedIn = function(cognitoUser, session) {
    this.init = () => {
        AWSInitialize(session.getIdToken().getJwtToken());

        WindowHelper.show('logged_in');
        $('#logged_in #user_name').text(cognitoUser.getUsername());

        this.listUserAttributes();
        this.listUserDevices();

        $('#logged_in #signOutBtn').click(function(){
            cognitoUser.globalSignOut();
            new Login();
        });
    };

    this.listUserAttributes = () => {
        var attributesBox = $('#user_attributes');
            attributesBox.html('');

        cognitoUser.getUserAttributes(function(err, result) {
            if (err) {
                alert(err);
                new Login({refresh: true});
                return;
            }
            $.each(result, function(idx, attribute){
                attributesBox.append($('<li/>', {html: 'attribute <a>' + attribute.getName() + '</a> has value <a>' + attribute.getValue() + '</a>'}));
            });
        });
    };

    this.listUserDevices = () => {
        var devicesBox = $('#user_devices');
            devicesBox.html('');

        var limit = 20;
        var paginationToken = null;

        cognitoUser.listDevices(limit, paginationToken, {
            onSuccess: function (result) {
                $.each(result.Devices, function(idx, device){
                    var deviceDescription = "device <a>" + device.DeviceKey + "</a>";

                    $.each(device.DeviceAttributes, function(idx, attribute){
                        deviceDescription += " attribute <a>" + attribute.Name + "</a> is <a>" + attribute.Value + "</a>";
                    });

                    devicesBox.append($('<li/>', {html: deviceDescription}));
                });
            },
            onFailure: function(err) {
                alert(err);
                new Login({refresh: true});
            }
        });
    };

    this.init();
}

$('.loginBtn').click(() => {new Login()});
$('.registerBtn').click(() => {new Register()});

new Login();

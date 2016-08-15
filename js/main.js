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
        $.each(attributes, (idx, attribute) => {
            $("#" + formId).append(
                $('<label/>', {text: attribute, for: attribute}).append(
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

            var attributeList = $.map(nameValuePairs, (idx, nameValuePair) => { new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(nameValuePair) })
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

var MFAConfirmation = function(cognitoUser) {

    this.init = () => {
        WindowHelper.show('mfa_confirmation');
        $('#mfa_confirmation #user_name').text(cognitoUser.getUsername());
        $('#confirmBtn').click(function(){ this.confirm() }.bind(this));
    };

    this.confirm = (confirmationCode) => {
        cognitoUser.confirmRegistration(confirmationCode, true, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            new LoggedIn(cognitoUser);
        }.bind(this));
    };

    this.init();
}

var Login = function(){
    this.init = () => {
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
                AWSInitialize(result.getIdToken().getJwtToken());
                LoggedIn(cognitoUser);
            },

            onFailure: function(err) {
                alert(err);
            },

        });
    };

    this.init();
}

var AWSInitialize = function(token){
    AWS.config.region = AWSCognito.config.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : identityPoolId,
        region: AWSCognito.config.region,
        Logins : {
            'cognito-idp.' + AWSCognito.config.region + '.amazonaws.com/' + poolData.UserPoolId + '': token
        }
    });
}

var LoggedIn = function(cognitoUser) {
    this.init = () => {
        WindowHelper.show('logged_in');
        $('#logged_in #user_name').text(cognitoUser.getUsername());

        this.listUserAttributes();
        this.listUserDevices();
    };

    this.listUserAttributes = () => {
        var attributesBox = $('#user_attributes');
            attributesBox.html('');

        cognitoUser.getUserAttributes(function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            $.each(result, function(idx, attribute){
                attributesBox.append($('<li/>', {text: 'attribute ' + attribute.getName() + ' has value ' + attribute.getValue()}));
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
                console.log(result);
                $.each(result, function(idx, device){
                    devicesBox.append($('<li/>', {text: device}));
                });
            },
            onFailure: function(err) {
                alert(err);
            }
        });
    };

    this.init();
}

$('.loginBtn').click(() => {new Login()});
$('.registerBtn').click(() => {new Register()});

//all the provided keys are examples, go to Amazon Cognito and get yours

AWSCognito.config.region = 'eu-west-1'; //This is required to derive the endpoint

var poolData = {
    UserPoolId : 'eu-west-1_9jknknuuu7i97', // your user pool id here
    ClientId : '9832knksndh382u3ukjkjiuiu' // your client id here
};

var identityPoolId = 'eu-west-1:928sjpf-283osj3-293us3js-82372-730s'; //go to AWS Cognito Federated Identites

var userAttributes = ['email', 'phone_number']; //the standard attributes you require in AWS Cognito

var MFARequired = true; //do you require your clients to use MFA?
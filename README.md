# aws-cognito-js-login

Shows correct set up and usage of https://github.com/aws/amazon-cognito-identity-js in a Demo Application. The Application allows a user to sign-up with different User-Atrributes. It can be used with MFA settings enabled.

## Setup
<b>First step</b>:
Clone this project and download the following Libraries to a folder named `/dist`:

1. [/dist/aws-cognito-sdk.min.js](https://raw.githubusercontent.com/aws/amazon-cognito-identity-js/master/dist/aws-cognito-sdk.min.js) 
2. [/dist/amazon-cognito-identity.min.js](https://raw.githubusercontent.com/aws/amazon-cognito-identity-js/master/dist/amazon-cognito-identity.min.js)
3. [JavaScript BN library](http://www-cs-students.stanford.edu/~tjw/jsbn/)
4. [Stanford JavaScript Crypto Library](https://github.com/bitwiseshiftleft/sjcl)

For more information about the dependencies [click here](https://github.com/aws/amazon-cognito-identity-js/blob/master/README.md#setup)


<b>Second step</b>Go to the AWS Cognito Console and create a new User Pool:
For the settings used in this application enable MFA and choose next to `email` as required attribute `phone number`.
<img width="300px" height="auto" src="https://cloud.githubusercontent.com/assets/3428184/17666091/d804eefe-62fe-11e6-9a22-da41b8995708.png">





https://mobile.awsblog.com/post/TxBVEDL5Z8JKAC/Use-Amazon-Cognito-in-your-website-for-simple-AWS-authentication
The Pattern Library

https://github.com/aws/amazon-cognito-identity-js

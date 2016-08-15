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

<hr>
<b>Second step</b>:
Go to the AWS Cognito User Pools and create a new User Pool:
For the settings used in this application enable MFA and choose next to `email` as required attribute `phone number`.
<img width="300px" height="auto" src="https://cloud.githubusercontent.com/assets/3428184/17666091/d804eefe-62fe-11e6-9a22-da41b8995708.png">

When creating the Client app it's <b>IMPORTANT</b> to uncheck the generate client secret box. Because the JavaScript SDK doesn't support apps that have a client secret. <img width="300px" height="auto" src="https://cloud.githubusercontent.com/assets/3428184/17666089/d51743cc-62fe-11e6-8309-4e6dd87c4c94.png"/>

<hr>
<b>Third step</b>:
Go to AWS Cognito Federated Identites and create a new Identity Pool for your User Pool.
<img width="300px"  src="https://cloud.githubusercontent.com/assets/3428184/17666392/51d70482-6300-11e6-9f69-fc0c344b0307.png" />

For your Identity Pool you can create a Authenticated role as well as a Unauthenticated role, where you can define what your users are allowed to do. For example reading from/uploading to S3.

<img width="300px" src="https://cloud.githubusercontent.com/assets/3428184/17666545/e0ae2992-6300-11e6-9368-46fc01b83389.png"/>

<hr>
<b>Forth step</b>:
After you created all necessary AWS rescources, you need to reference them in your application. For that open the file `config.js` and edit the variables. The Ids like `identityPoolId` or `UserPoolId` you are able to see in the AWS Console.

<hr>
<b>Great, be your first user</b>
Open `index.html` in your browser and sign up for your client app.

## This is what you will get:

<img  width="400px"  src="https://cloud.githubusercontent.com/assets/3428184/17666912/d1e62ad4-6302-11e6-9302-edd6af20d201.png"/>
<img  width="400px"  src="https://cloud.githubusercontent.com/assets/3428184/17667007/408bb8b4-6303-11e6-8e4f-a0682fadb17d.png"/>
<img width="400px"  src="https://cloud.githubusercontent.com/assets/3428184/17667050/70445bec-6303-11e6-874a-9d8018be3048.png"/>
<img width="400px"  src="https://cloud.githubusercontent.com/assets/3428184/17667014/4703b214-6303-11e6-9143-b8a5ae62327b.png"/>

## Links

[Article](https://mobile.awsblog.com/post/TxBVEDL5Z8JKAC/Use-Amazon-Cognito-in-your-website-for-simple-AWS-authentication) 
about Amazon Cognito in the Browser. 

Here you can find the docs for [Official amazon-cognito-identity-js](https://github.com/aws/amazon-cognito-identity-js)

The kiwi background pattern can be found [here](http://thepatternlibrary.com/#kiwis)

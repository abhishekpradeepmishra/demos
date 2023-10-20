
# <span style="color:red">THIS CODE IS FOR DEMO PURPOSE ONLY, NOT TO BE  USED AS IS IN PROD</span>.

# Fraud demo using Amazon Neptune

## Steps to deploy

## Pre-requisite

* SAM CLI
* Node js

### Deploy backend API
* Run commands

```
npm install
sam build
sam deploy --guided
```

* Copy value of "WebEndpoint" from CFN template output

### Build and run front end 

### Update back end api endpoint in Network.js file

```
const APIPath = "<BACKEND API ENDPOINT>"
```

* Run commands
```
npm install
npm start
```

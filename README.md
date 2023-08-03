#  Auth Service

This service for providing JWT tokens based auth system for web app's.

## How it works?
This service have certain endpoints:
- POST /register 
- POST /login
- GET  /token
- GET  /logout
- GET  /verify
- GET  /user

#### /register 
This endpoint require the user data for  registration such as email and password
#### /login 
This endpoint require the user credentions like registration  for getting authorization
#### /token 
This endpoint require the refresh token in httpOnly cookie for genereate new access and refresh token for user threby extending the authorization:
#### /logout 
This endpoint require the refresh token in httpOnly cookie for logout user and delete current session from DB:
#### /verify 
This endpoint getting the user request with email verification token as query which been sended after registration
#### /user
This endpoint cheking the access token for current user and if it's ok return the user credentions
 

### Getting started

Dev requirements to run this auth service:

- [nodeJS](https://nodejs.org/docs)
- [mongoDB](https://www.mongodb.com/atlas/database)

You shoud create the data base and getting the url to connetc to mongoDB

Specify the database url and name to the .env variable "DB_NAME","DB_URL"

In the root of this repo, run the following commands to start auth service:

```
npm i

npm run start
```



#### Example of requesting a token from the auth service

After obtaining the registration and confirm the email, we make a request to the auth server to obtain a token.

Run the following:

```
curl "http://localhost:5001/api/login"
data:{email:someemail@.com,password:somepass}

*Note: if you are making request from browser inputs, you shoud spicify the CORS alows on auth service *

If login info is correct this should output something like the following:

```
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDM5OTU3NzAsImlhdCI6MTU0Mzk5NTQ3MCwiYWNjZXNzIjpbeyJ0eXBlIjoiYXJ0aWZhY3QtcmVwb3NpdG9yeSIsIm5hbWUiOiJvcmcxL3JlcG8xIiwiYWN0aW9ucyI6WyJwdWxsIl19XX0.0Ajgwy5Yhl_HwF3yKoggicpxCiFTffiGcWVxhttR_SU3czn2WogkRazXAAQE2CuIzganw5u5WDuZIBPC2RucP8KT5uKvKDiakDsVYHMACCDjpTotAWamZF2MFCTpXzhpCLkcv_dgGHnInGV_VYJj1xhD6B4ksuxMpDflLCNPqV4GyTxdrIplRxurePNLs5yLKngMXs42eAsD44FGDSLbW65RLM7QFZaUvwlbcst0g9KsVxN4NJ4uIPS-dC0HOvdf6bw2E_GTbpTcpzgn5gMXKzKGFxTi8Tch-NA9t6jghsEDUk3WYJGH1Ko0-xI8XpjYf6l4wQ6_Yg2dGrMBxFqfmQ"
}
```

`accessToken` is a signed JWT token that indicates access to perform the action `pull` on the `org1/repo1` namespace. It is set to expire in 5 minutes.

You can decode this token on [https://jwt.io](http://jwt.io/#id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDM5OTU3NzAsImlhdCI6MTU0Mzk5NTQ3MCwiYWNjZXNzIjpbeyJ0eXBlIjoiYXJ0aWZhY3QtcmVwb3NpdG9yeSIsIm5hbWUiOiJvcmcxL3JlcG8xIiwiYWN0aW9ucyI6WyJwdWxsIl19XX0.0Ajgwy5Yhl_HwF3yKoggicpxCiFTffiGcWVxhttR_SU3czn2WogkRazXAAQE2CuIzganw5u5WDuZIBPC2RucP8KT5uKvKDiakDsVYHMACCDjpTotAWamZF2MFCTpXzhpCLkcv_dgGHnInGV_VYJj1xhD6B4ksuxMpDflLCNPqV4GyTxdrIplRxurePNLs5yLKngMXs42eAsD44FGDSLbW65RLM7QFZaUvwlbcst0g9KsVxN4NJ4uIPS-dC0HOvdf6bw2E_GTbpTcpzgn5gMXKzKGFxTi8Tch-NA9t6jghsEDUk3WYJGH1Ko0-xI8XpjYf6l4wQ6_Yg2dGrMBxFqfmQ) or with something like [jwt-cli](https://github.com/mike-engel/jwt-cli).

If you examine the token payload, it will resemble the following:

```
{
  "exp": 1543995770,
  "iat": 1543995470,
  "user": 
    {
      "email":someemail@.com,
      "id": "83i8h9f89h2938hr",
      
    }
}
```




# Private Blockchain Notary Service for a Star Registry

This program creates a Star Registry service that allows users to claim ownership of their favorite star in the night sky.<br>

There are 3 main components to this blockchain asset star registry
1. Validate a wallet address to be able to work with the blockchain  
2. Allow stars to be registered to the blockchain   
3. View the stars on the blockchain  

## The Wallet Validation Routine Process:<br>
1. Issue POST message to http://localhost:8000/requestValidation
* The message contents includes the user wallet address as follows:
```
{
	"address": "19TZkF3mmpsGieFx9sDyPWKGYW1P4ta6no"
}
```
The returned message must be signed and verified by your wallet. This will be used in the next step in the signature field.<br>

2. Issue POST message to http://localhost:8000/message-signature/validate
* The message contents includes the user wallet address and the signature of the message as follows:
```
{
	"address": "19TZkF3mmpsGieFx9sDyPWKGYW1P4ta6no",
  "signature": "H4gSPsOzAs8T4TmvGXPJQB4qNduGAFbTgXglYfgsRfgwYbHh1kwG0ESzsnKVSSkjal3HsbRb0wZHWoj8fRB40gU="
}
```
<b>The Wallet Validation Routine must be completed within 300 seconds</b><br>

## Register a star on the blockchain:<br>
1. Issue POST message to http://localhost:8000/block
* The message contents includes the following:
```
{
	"address": "19TZkF3mmpsGieFx9sDyPWKGYW1P4ta6no",
  	"star" : {
  		"ra": "dd",
  		"dec": "-26 29 24.9",
  		"story": "October 23rd - posting a second star"
  	}
}
```
If the wallet address has not been validated, the star registration will fail.

## View the stars on the blockchain<br>
The Star Registry Service API calls include:<br>
1. Call to Root to display Welcome Message - use "localhost:8000/"<br>
2. Call to GET stars by a specific wallet - use localhost:8000/stars/address:[wallet address]
3. Call to GET a star by a specific block hash - use localhost:8000/stars/hash:[hash value]
4. Call to GET a star by the block height - use localhost:8000/block/[block#]

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```

## Run the program
1. Move to root directory (includes the index.js file)<br>
2. Run index.js by entering> "node index.js"<br>
3. Validate wallet address if you want to be able to register stars
4. The stars can be viewed without wallet registration

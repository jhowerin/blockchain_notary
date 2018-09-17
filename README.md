# Web API with simpleChain blockchain  

This program creates 4 custom API endpoints for the simpleChain blockchain.<br>

The simpleChain blockchain creates a private blockchain that includes SHA256 to hash each block and level to create a
persistent database.<br>

The class Blockchain constructor creates the genesis block. The addBlock function will get the current chain height and then add a new block to the chain and console log messages will print to screen the hash information. Validation functions include validateBlock and validateChain - console log messages will print to screen showing block hash and previous hash information. By default, when the program runs, 10 blocks are automatically created.<br>

The Web API calls include:<br>
1. Call to Root to display Welcome Message - use "localhost:8000/"<br>
1. Call to GET all blocks - use "localhost:8000/blocks"<br>
1. Call to GET a specific block - use "localhost:8000/block/:id", where id is the number of the block to GET<br>
1. Call to POST a new block - use "localhost:8000/block" and the POST details include:<br>
  *   Use application/json as the format type and enter the block in json format <br>
        {
          "block": "the body contents of whatever you want"
        }

## Framework  

The express framework is used.  

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install express with --save flag
```
npm install express --save
```
- Install body-parser with --save flag
```
npm install body-parser --save
```

## Testing

### Test by running program
1: Move to directory with simpleChain.js  
2: Run simpleChain.js by entering> "node simpleChain.js"<br>
3: 10 blocks are automatically created each time simpleChain is run.  
4: The blocks can be tested with the API calls defined above

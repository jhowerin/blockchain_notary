# Private blockchain  

This program creates a private blockchain that includes SHA256 to hash each block and level to create a
persistent database.<br>

When the program is run, the chain and blocks are validated and then new blocks are added to the chain.
For each block added, the block hash and previous block hash are printed to screen.<br>

The class Blockchain constructor creates the genesis block. The addBlock function will get the current chain height and then add a new block to the chain and console log messages will print to screen the hash information. Validation functions include validateBlock and validateChain - console log messages will print to screen showing block hash and previous hash information.


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

## Testing

### Test by running program
1: Move to directory with simpleChain.js  
2: Run simpleChain.js by entering> node simpleChain.js  

### Test using REPL
To test code using Node REPL (Read-Evaluate-Print-Loop)  
1: Open a command prompt or shell terminal after install node.js.  
2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).  
```
node
```
3: Copy and paste your code into your node session  
4: Instantiate blockchain with blockchain variable
```
let blockchain = new Blockchain();
```
5: Generate 10 blocks using a for loop
```
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new Block("test data "+i));
}
```
6: Validate blockchain
```
blockchain.validateChain();
```
7: Induce errors by changing block data
```
let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
}
```
8: Validate blockchain. The chain should now fail with blocks 2,4, and 7.
```
blockchain.validateChain();
```

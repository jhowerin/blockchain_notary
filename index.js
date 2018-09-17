// Using express.js node.js web frameworkd
const express = require('express')
const app = express()

// Importing the simpleChain.js file that includes the classes
// Block and blockChainHeight
const {Block,Blockchain} = require("./simpleChain.js")
const theBlock = new Blockchain();


// body-parser required for POST method
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.json());
app.use(express.urlencoded());


// API endpoint calls
// aka the routes
app.get('/', (req, res) => {
  let welcome_msg = '';
  welcome_msg += '<h1><b>Welcome to the simpleChain API !<br>';
  welcome_msg += '==========================</h1></b><br>';
  welcome_msg += '<p>There are 4 supported API calls.  Users can call a root, get all blocks,'
  welcome_msg += 'get a specific block and post a new block.</p>';
  welcome_msg += 'The current <b>simpleCbhain API</b> calls include:<br><br>';
  welcome_msg += 'HTTP GET using "/" to access the simpleChain root and Welcome page<br>';
  welcome_msg += 'HTTP GET using "/blocks" to get all blocks<br>';
  welcome_msg += 'HTTP GET using "/block/:id" to get a specific block<br>';
  welcome_msg += 'HTTP POST using "/block" to post a new block to the chain<br>';
  welcome_msg += '==========================<br>';
  welcome_msg += 'All API responses are in JSON format<br>';
  welcome_msg += 'Please see README for more details<br>';
  res.send(welcome_msg);
});

app.get('/blocks', async (req,res) => {
  try {
    const height = await theBlock.getBlockHeight();
    const blocks = [];

    for (let i=0; i<=height; i++){
      blocks.push(await theBlock.getBlock(i));
    }
    res.send(blocks);
  }  catch(error){
     res.status(404).json({
        "status": 404,
        "message": "All blocks GET request cannot be returned"
      })
  }
});

app.get('/block/:id', async (req, res) => {
  try {
    const response = await theBlock.getBlock(req.params.id)
    res.send(response)
  } catch (error) {
    res.status(404).json({
      "status": 404,
      "message": "The block with the height " + req.params.id + " cannot be found"
    })
  }
})

app.post('/block/', async(req, res) => {
  let newBlock = req.body.block;
  //let newBlock = await theBlock.addBlock(req.body);
  if(newBlock){
  	theBlock.addBlock(new Block(newBlock));
  	res.send(newBlock);
  } else {
  res.status(400).json({
    "status": 400,
    "message": "Bad POST request - possible empty block"
    })
  }  // end if-else
})

// defining the port number to listen on
const port = 8000
// Server listing on port <port>
app.listen(port, () => console.log(`Blockchain API listening on port ${port} !`))

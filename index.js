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

// wallet address list
let addressList = [];
// validated wallet address list
let validatedAddressList = [];
// Validation periood that its open in seconds
// function requestValidation
const validationWindow = 300;
// used in function message-signature/validate
const bitcoinMessage = require('bitcoinjs-message');

// API endpoint calls
// aka the routes

app.use(bodyParser.json());
app.use('/', express.static('front'));
app.use('/static', express.static('static'));

app.get('/registry', (req,res) => {
  let hello = "HELLO !!!!!";
  res.send(hello);
});

app.get('/welcome', (req, res) => {
  let welcome_msg = '';
  welcome_msg += '<h1><b>Welcome to the Blockchain Star Registry !<br>';
  welcome_msg += '================================</h1></b><br>';
  welcome_msg += '<p>This program creates a Star Registry service that allows users to claim ownership of their favorite star in the night sky.</p><br>'
  welcome_msg += '<h3>There are 3 main components to this blockchain asset star registry</h3><br>';
  welcome_msg += '===============================================<br>';
  welcome_msg += '1. Validate a wallet address to be able to work with the blockchain<br>';
  welcome_msg += '2. Allow stars to be registered to the blockchain<br>';
  welcome_msg += '3. View the stars on the blockchain<br>';
  welcome_msg += '===============================================<br><br>';
  welcome_msg += 'Please see README to learn how to use the Blockchain Star Registry API<br>';
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
    let response = await theBlock.getBlock(req.params.id)
    //decode the response block
    response.body.star.storyDecoded = Buffer.
                                      from(response.body.star.story, 'hex').
                                      toString('ascii');
    res.send(response)
  } catch (error) {
    res.status(404).json({
      "status": 404,
      "message": "The block with the height " + req.params.id + " cannot be found"
    })
  }
})

app.post('/block/', async(req, res) => {
  const address = req.body.address;
  const star = req.body.star;

  console.log(validatedAddressList);
  // check if the address is in the body
  if(!address) {
    return res.status(400).json({error: "The wallet address was not received"});
  }
  // check if the address has been validated and is in the validatedAddressList
  else if(!validatedAddressList.includes(address)) {
    return res.status(400).json({error: "The wallet address has not been validated"});
  }
  // check the star RA contents is in the body
  else if(!star.ra) {
    return res.status(400).json({error: "The star right ascension was not received"});
  }
  // check the star declination contents is in the body
  else if(!star.dec) {
    return res.status(400).json({error: "The star declination was not received"});
  }
  // check the star story was received
  else if(!star.story) {
    return res.status(400).json({error: "The star story was not received"});
  }
  else {
    console.log("All the required block contents was received");
  }
  //limit the star story to 500 bytes
  star.story = Buffer.from(star.story, 'ascii').toString('hex');
  if (star.story.length > 500) {
    console.log("Star story too large - must be 500 B or less");
    return res.status(400).json({error: "The star story must be 500 bytes or less"});
  }

  let newBlock = {
    address: address,
    star: star
  }
  //let newBlock = await theBlock.addBlock(req.body.block);
  if(newBlock){
  	await theBlock.addBlock(new Block(newBlock));
    const height = await theBlock.getBlockHeight();
    //console.log(`the height is ${height}`);
    const response = await theBlock.getBlock(height);
  	res.send(response);
  } else {
  res.status(400).json({
    "status": 400,
    "message": "Bad POST request"
    })
  }  // end if-else
})

// Section specific to the Star Notary Service
// Configure the Blockchain ID Validation Routing
app.post('/requestValidation/', (req, res) => {
  const address = req.body.address;
  let initialTime = Math.round(+new Date / 1000);
  //if there is no address in the message, then we will return an error message
  if (!address)
    return res.status(400).send({message: 'address is required.'});
  // if there is no address index in the addressList array, we add a time
  if(!addressList[address]){
    addressList[address] = initialTime;
    console.log(`Initial time ${initialTime}`);
  }
  // create the message response parameters
  const messageResponse = `${address}:${addressList[address]}:starRegistry`
  const currentTime = Math.round(+new Date / 1000);
  const timeRemaining = addressList[address] + validationWindow - currentTime
  res.send({
    address: address,
    requestTimeStamp: addressList[address],
    message: messageResponse,
    validationWindow: timeRemaining
  });
  console.log(addressList);
});

//help

app.post('/message-signature/validate/', (req, res) => {
  //
  const address = req.body.address;
  const signature = req.body.signature;
  const message = `${address}:${addressList[address]}:starRegistry`

  // Check if the 300 second time to validate has expired
  const initialTime = addressList[address];
  const currentTime = Math.round(+new Date / 1000);
  const timeChange = currentTime - initialTime;

  if(timeChange > validationWindow) {
    console.log("Deleting addressList entry");
    delete addressList[address];
    return res.status(400).send('The validation timer has expired. Please submit a new request');
  }

  const timeRemaining = addressList[address] + validationWindow - currentTime;
  const isValid = bitcoinMessage.verify(message, address, signature);

  if (isValid) {
    validatedAddressList.push(address);
    response = {
      registerStar: true,
      status: {
        address: address,
        requestTimeStamp: addressList[address],
        message: message,
        validationWindow: timeRemaining,
        messageSignature: 'valid'
      }
    };
  } else {
    response = {
      registerStar: false,
      status: {
        address: address,
        requestTimeStamp: addressList[address],
        message: message,
        validationWindow: timeRemaining,
        messageSignature: 'inValid'
      }
    };
  }
  console.log(`The current validated addressList includes ${validatedAddressList}`);
  res.send(response);
});

app.get('/stars/address::address', async (req, res) => {
  const address = req.params.address;
  //check is an address was received
  if (!address)
    return res.status(400).send({message: 'address is required.'});
  try {
    const height = await theBlock.getBlockHeight();
    const starBlockList = [];

    for (let i=0; i<=height; i++){
      let starBlock = await theBlock.getBlock(i);
      if (starBlock.body.address === address) {
        //decode the starBlock
        starBlock.body.star.storyDecoded = Buffer.
                                            from(starBlock.body.star.story, 'hex').
                                            toString('ascii');
        starBlockList.push(starBlock);
      }
    }
    res.send(starBlockList);
   } catch(error){
      res.status(404).json({
        "status": 404,
        "message": "All blocks GET request cannot be returned"
      })
    }
});

app.get('/stars/hash::hash', async (req, res) => {
  const hash = req.params.hash;
  if (!hash)
    return res.status(400).send({message: '"hash" is required.'})
    try {
      const height = await theBlock.getBlockHeight();
      for (let i=0; i<=height; i++){
        let starBlock = await theBlock.getBlock(i);
        if (starBlock.hash === hash) {
          //decode the starBlock
          starBlock.body.star.storyDecoded = Buffer.
                                              from(starBlock.body.star.story, 'hex').
                                              toString('ascii');
          res.send(starBlock);
        }
      }
     } catch(error){
        res.status(404).json({
          "status": 404,
          "message": "Hash not found"
        })
      }
});

// defining the port number to listen on
const port = 8000
// Server listing on port <port>
app.listen(process.env.PORT || port, () => console.log(`Blockchain Star Notary service listening on port ${port} !`))

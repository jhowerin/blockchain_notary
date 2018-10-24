/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const SHA256 = require('crypto-js/sha256')
/* ===== Persist data with LevelDB ======================
|  Learn more: level: https://github.com/Level/level     |
|  =====================================================*/
const level = require('level')
const chainDB = './chaindata'
const db = level(chainDB)
/* ===== Block Class ==============================
|  Class with a constructor for block 			       |
|  ===============================================*/
class Block {
  constructor (data) {
    this.hash = '',
      this.height = 0,
      this.body = data,
      this.time = 0,
      this.previousBlockHash = ''
  }
}
/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/
class Blockchain {
  constructor () {
    // Add the genesis block if this is a new block
    this.getBlockHeight().then((height) => {
      if (height==-1) {
      this.addBlock(new Block('Genesis block')).then(() =>
      console.log('First block in the chain - Genesis block\n\n'))
    }
    })
  }
  // Add new block - adds it to the blockchain
  async addBlock (newBlock) {
    // Get the blockheight so we'll know where to add the block in the chain
    let currentBlockHeight = parseInt(await this.getBlockHeight())
    // new Block height is stored in the newBlock object
    newBlock.height = currentBlockHeight + 1;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0, -3)
    // previous block hash is stored in the newBlock object as the
    // previousBlockHash
    if (newBlock.height > 0) {
      let previousBlock = await this.getBlock(currentBlockHeight);
      newBlock.previousBlockHash = previousBlock.hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()
    console.log("New block being added")
    console.log("Block height   : " + newBlock.height);
    console.log("Block body address     : " + newBlock.body.address);
    console.log("Block body star :" + newBlock.body.star)
    console.log("New Block Hash : " + newBlock.hash);
    console.log("Pre Block Hash : " + newBlock.previousBlockHash);
    // Adding block object to levelDB instead of a non-persistent chain
    await this.addLevelDBData(newBlock.height, JSON.stringify(newBlock));
  }
  // Get block height from the LevelDB persistent data store
  async getBlockHeight () {
    return JSON.parse(await this.getHeightLevelDB());
  }

  // get block and its contents from the LevelDB data store by the height
  async getBlock (blockHeight) {
    // return object as a single string
    return JSON.parse(await this.getLevelDBData(blockHeight));
  }
  // validate block
  async validateBlock (blockHeight) {
    // get block object
    let block = await this.getBlock(blockHeight);
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash === validBlockHash) {
      return true
    } else {
      console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash)
      return false
    }
  }
  // Validate blockchain
  async validateChain () {
    let errorLog = [];
    let previousHash = '';
    // let blockChainHeight = await this.getBlockHeight()
    let blockChainHeight = await this.getHeightLevelDB();
    console.log("The Validation Process");
    console.log("======================");
    console.log("The current block hash will be compared to the previous block hash");
    console.log("They should be the same");
    console.log("======================");
    console.log("The block height is " + blockChainHeight);
    let i;
    for (i = 0; i <= blockChainHeight-1; i++) {
      // validate a single block
      if (!this.validateBlock(i)) errorLog.push(i)
      // compare blocks hash link
      console.log(`Validating the chain between block ${i} and block ${i+1}`);
      let block = await this.getBlock(i);
      let previousBlock = await this.getBlock(i+1);
      console.log("Block " + i + " hash is: " + block.hash);
      console.log("Block " + (i+1) + " prevsious hash is: " + previousBlock.previousBlockHash);
      console.log();
      let blockHash = this.getBlock(i).hash;
      let previousHash = this.getBlock(i+1).previousBlockHash;
      if (blockHash !== previousHash) {
        errorLog.push(i)
      }
    } // end for loop

    if (errorLog.length > 0) {
      console.log('Block errors = ' + errorLog.length)
      console.log('Blocks: ' + errorLog)
    } else {
      console.log('No errors detected')
    }
    console.log("Validated " + blockChainHeight + " blocks");
    console.log('\n');
  }

  // Get the block height level from the LevelDB
  // read the blockchain and increment the height for each block read.
  getHeightLevelDB () {
    return new Promise((resolve, reject) => {
      let height = -1;
      db.createReadStream().on('data', (data) => {
        height++;
      }).on('error', (err) => {
        console.log('Unable to read data stream!', err)
        reject(err)
      }).on('close', function() {
        resolve(height)
      })
    })
  }

  // Add data to levelDB with key/value pair
  addLevelDBData (key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value, (err) => {
        if (err) {
          console.log('Block ' + key + ' submission failed', err)
          reject(err)
        }
        else {
          console.log('Block #' + key + ' added')
          resolve(value)
        }
      })
    })
  }

  // Get data from levelDB with key
  getLevelDBData (key) {
    return new Promise((resolve, reject) => {
      db.get(key, (err, value) => {
        if (err) {
          console.log('Not found!', err)
          reject(err)
        } else {
          // console.log('Value = ' + value)
          resolve(value)
        }
      })
    })
  }
}


module.exports = {
  Block,
  Blockchain
};

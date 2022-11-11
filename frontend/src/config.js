export const AUCTION_ADDRESS = '0x05c99E29314327456B01d461dc08Cc308fce3680'

export const AUCTION_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "AuctionInstanceCreated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "auctionInstanceCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "auctionInstances",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "cosigner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "startingPrice",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_content",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "startingPrice",
          "type": "uint256"
        }
      ],
      "name": "createAuctionInstance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
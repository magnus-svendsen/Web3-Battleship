export const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "ended",
        "type": "bool"
      }
    ],
    "name": "GameOver",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "started",
        "type": "bool"
      }
    ],
    "name": "GameStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "x",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "y",
        "type": "uint8"
      }
    ],
    "name": "MoveMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "hit",
        "type": "uint8"
      }
    ],
    "name": "RegisterHit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "TimeoutStarted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "betAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cancel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimTimeout",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "eventToggler",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "eventToggler2",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameOver",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "shipsRemaining",
            "type": "uint8"
          },
          {
            "internalType": "uint8[10][10]",
            "name": "grid",
            "type": "uint8[10][10]"
          }
        ],
        "internalType": "struct Battleship.PlayerData",
        "name": "pl",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "length",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "timesHit",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "isDestroyed",
            "type": "bool"
          },
          {
            "internalType": "uint8[2][]",
            "name": "coordinates",
            "type": "uint8[2][]"
          }
        ],
        "internalType": "struct Battleship.Ship[]",
        "name": "_ships",
        "type": "tuple[]"
      }
    ],
    "name": "join",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "x",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "y",
        "type": "uint8"
      }
    ],
    "name": "move",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "player1",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "player2",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "players",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "shipsRemaining",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "name": "shipCoordinates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ships",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "length",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "timesHit",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isDestroyed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "startTimeout",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "state",
    "outputs": [
      {
        "internalType": "address",
        "name": "whoseTurn",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "timeout",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "timeoutInterval",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const
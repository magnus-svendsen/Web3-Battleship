// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Battleship {
    address public player1;
    address public player2;
    bool public gameOver;
    address public whoseTurn;

    struct PlayerData {
        uint8 shipsRemaining;
        uint8[10][10] grid; // Player's grid
    }

    struct Ship {
        uint8 length;
        uint8 timesHit;
        bool isDestroyed;
        uint8[2][] coordinates; // array of (x, y) coordinates
    }

    mapping(address => PlayerData) public players;
    mapping(address => Ship[]) public ships;
    mapping(address => mapping(uint8 => mapping(uint8 => uint))) public shipCoordinates; // Mapping to track ship coordinates

    event GameStarted(bool started);
    event RegisterHit(address player, uint8 hit);

    constructor() {
        gameOver = true; // Initialize gameOver to true
    }

    function join(PlayerData memory pl, Ship[] memory _ships) public {
        require(player2 == address(0), "Game has already started.");
        require(gameOver, "A game is already in progress.");

        if (address(player1) != address(0) && msg.sender != address(player1)) {
            player2 = msg.sender;

            players[player2] = pl;
            for (uint i = 0; i < _ships.length; i++) {
                ships[player2].push(_ships[i]);
            }

            // Store player grid and ships
            PlayerData storage player2Data = players[player2];
            player2Data.shipsRemaining = uint8(_ships.length);

            // Set turn to player 1
            whoseTurn = player1;
            gameOver = false; // Set gameOver to false when the game starts
            emit GameStarted(true); // Emit GameStarted event with true
        } else {
            player1 = msg.sender;

            players[player1] = pl;
            for (uint i = 0; i < _ships.length; i++) {
                ships[player1].push(_ships[i]);
            }
        }
    }

    function cancel() public {
        require(msg.sender == player1, "Only first player may cancel.");
        require(player2 == address(0), "Game has already started.");

        gameOver = true;
        emit GameStarted(false);
    }

    function move(uint8 x, uint8 y) public {
        require(!gameOver, "Game has ended.");
        require(msg.sender == whoseTurn, "Not your turn.");
        require(
            (x >= 0 && x < 10) && (y >= 0 && y < 10),
            "Move out of range. X and Y coordinates must be between 0 and 9."
        );

        PlayerData storage opponentData = players[opponentOf(msg.sender)];
        require(
            opponentData.shipsRemaining > 0,
            "Game over, no ships remaining!"
        );

        if (opponentData.grid[x][y] == 1) {
            // Ship hit
            opponentData.grid[x][y] = 3; // Mark as hit
    
            // Check if any ship is destroyed
            uint shipIndex = shipCoordinates[opponentOf(msg.sender)][x][y];
            Ship storage ship = ships[opponentOf(msg.sender)][shipIndex];

            ship.timesHit += 1;
            emit RegisterHit(msg.sender, 3);
            if (ship.timesHit == ship.length) {
                ship.isDestroyed = true;
                opponentData.shipsRemaining -= 1;

                if (opponentData.shipsRemaining == 0) {
                    gameOver = true;
                    emit GameStarted(false);

                }
            }
        } else {
            // No ships hit
            emit RegisterHit(msg.sender, 0);
        }

        // Switch turns
        whoseTurn = opponentOf(msg.sender);
    }

    function opponentOf(address player) internal view returns (address) {
        require(player2 != address(0), "Game has not started.");
        return player == player1 ? player2 : player1;
    }
}

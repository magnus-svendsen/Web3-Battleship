// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Multiplayer {
    uint256 public gameId; // Current game session identifier
    address public player1;
    address public player2;
    bool public gameOver;

    // Instead of using a mapping for each cell, we store all ship placements in one uint256.
    // For cells 0–99, bit i indicates whether a ship occupies that cell.
    struct PlayerData {
        uint256 ships;        // Bitmask for ship placements.
        uint8 remainingCells;
        bool shipsPlaced;
    }

    // A double mapping: gameId => (player address => PlayerData)
    mapping(uint256 => mapping(address => PlayerData)) private gamePlayers;

    // Events with gameId included
    event FirstPlayerJoined(uint256 gameId, address indexed player);
    event SecondPlayerJoined(uint256 gameId, address indexed player);
    event ShipPlacement(uint256 gameId, address indexed player);
    event BothPlayersPlacedShips(uint256 gameId, bool placed);
    event MoveResult(uint256 gameId, address indexed player, bool hit, uint8 pos, bool gameOver);
    event GameReset(uint256 newGameId);

    constructor() {
        gameId = 1; // Start at game 1.
    }

    /// @notice Join the game. The first caller becomes player1; the second becomes player2.
    function join() public {
        require(player1 == address(0) || player2 == address(0), "Game already has 2 players");

        if (player1 == address(0)) {
            player1 = msg.sender;
            emit FirstPlayerJoined(gameId, player1);
        } else {
            require(msg.sender != player1, "Already joined as player1");
            player2 = msg.sender;
            emit SecondPlayerJoined(gameId, player2);
        }
    }

    /// @notice Place your ships by providing an array of encoded positions.
    /// Each position is a number between 0 and 99 (calculated as row * 10 + col).
    /// Uses a bitmask to store ship positions to save gas.
    function placeShips(uint8[] calldata positions) public {
        PlayerData storage pd = gamePlayers[gameId][msg.sender];
        require(!pd.shipsPlaced, "Ships have already been placed");
        require(positions.length > 0, "No ship positions provided");

        for (uint i = 0; i < positions.length; i++) {
            uint8 pos = positions[i];
            require(pos < 100, "Position out of range");
            // Check for duplicates using bitmask: if bit is already set, duplicate exists.
            require((pd.ships & (1 << pos)) == 0, "Duplicate position provided");
            // Set the bit for this position.
            pd.ships |= (1 << pos);
        }
        pd.remainingCells = uint8(positions.length);
        pd.shipsPlaced = true;
        emit ShipPlacement(gameId, msg.sender);

        // Check if both players have placed their ships.
        if (gamePlayers[gameId][player1].shipsPlaced && gamePlayers[gameId][player2].shipsPlaced) {
            emit BothPlayersPlacedShips(gameId, true);
        }
    }

    /// @notice Make a move by specifying coordinates (x, y).
    /// The coordinates are encoded using the same formula (x * 10 + y) and then checked against the opponent's ship mapping.
    function move(uint8 x, uint8 y) public {
        require(!gameOver, "Game is over");
        require(x < 10 && y < 10, "Coordinates out of range");
        require(player1 != address(0) && player2 != address(0), "Game not started, missing player");

        // Determine the opponent.
        address opponent = msg.sender == player1 ? player2 : player1;
        PlayerData storage opponentData = gamePlayers[gameId][opponent];
        uint8 pos = x * 10 + y;
        bool hit = false;

        // Check if the opponent has a ship at that position using the bitmask.
        if ((opponentData.ships & (1 << pos)) != 0) {
            // Mark the cell as hit: clear that bit.
            opponentData.ships &= ~(1 << pos);
            opponentData.remainingCells--;
            hit = true;
            if (opponentData.remainingCells == 0) {
                gameOver = true;
                emit MoveResult(gameId, msg.sender, hit, pos, gameOver);
            }
        }
        if (!gameOver) {
            emit MoveResult(gameId, msg.sender, hit, pos, gameOver);
        }
    }

    /// @notice Resets the game state for a new game.
    /// Instead of clearing the existing mapping data, it increments the gameId so that a new game uses a fresh mapping.
    function resetGame() public {
        // Clear current gamePlayers mapping entries
        if (player1 != address(0)) {
            delete gamePlayers[gameId][player1];
        }
        if (player2 != address(0)) {
            delete gamePlayers[gameId][player2];
        }
        player1 = address(0);
        player2 = address(0);
        gameOver = false;
        gameId++;  // Increment gameId for the new game session.
        emit GameReset(gameId);
    }
}

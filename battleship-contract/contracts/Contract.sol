// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Battleship {
    uint256 public gameId; // Current game session identifier
    address public player1;
    address public player2;
    bool public gameOver;
    address public whoseTurn;

    struct PlayerData {
        // Mapping from an encoded cell (0 to 99) to a bool indicating whether a ship exists there.
        // When a ship is hit, the mapping value is set to false.
        mapping(uint8 => bool) ships;
        uint8 remainingCells;
        bool shipsPlaced;
    }

    // A double mapping: gameId => (player address => PlayerData)
    mapping(uint256 => mapping(address => PlayerData)) private gamePlayers;

    // Events with gameId included
    event PlayerJoined(uint256 gameId, address indexed player);
    event GameStarted(uint256 gameId, bool started);
    event ShipPlacement(uint256 gameId, address indexed player, uint8[] positions);
    event BothPlayersPlacedShips(uint256 gameId, bool placed);
    event MoveResult(uint256 gameId, address indexed player, bool hit, uint8 pos);
    event GameOver(uint256 gameId, address winner);
    event GameReset(uint256 newGameId);

    constructor() {
        gameId = 1; // Start at game 1.
    }

    /// @notice Join the game. The first caller becomes player1; the second becomes player2.
    function join() public {
        require(player1 == address(0) || player2 == address(0), "Game already has 2 players");

        if (player1 == address(0)) {
            player1 = msg.sender;
            emit PlayerJoined(gameId, player1);
        } else {
            require(msg.sender != player1, "Already joined as player1");
            player2 = msg.sender;
            // Start the game once both players have joined.
            whoseTurn = player1;
            gameOver = false;
            emit GameStarted(gameId, true);
        }
    }

    /// @notice Place your ships by providing an array of encoded positions.
    /// Each position is a number between 0 and 99 (calculated as row * 10 + col).
    /// For example, a ship cell at (3, 1) is encoded as 31.
    function placeShips(uint8[] calldata positions) public {
        require(msg.sender == player1 || msg.sender == player2, "Only players can place ships");
        // Use the current gameId mapping.
        PlayerData storage pd = gamePlayers[gameId][msg.sender];
        require(!pd.shipsPlaced, "Ships have already been placed");
        require(positions.length > 0, "No ship positions provided");

        for (uint i = 0; i < positions.length; i++) {
            uint8 pos = positions[i];
            require(pos < 100, "Position out of range");
            // Prevent duplicate positions.
            require(!pd.ships[pos], "Duplicate position provided");
            pd.ships[pos] = true;
        }
        pd.remainingCells = uint8(positions.length);
        pd.shipsPlaced = true;
        emit ShipPlacement(gameId, msg.sender, positions);

        // Check if both players have placed their ships.
        if (gamePlayers[gameId][player1].shipsPlaced && gamePlayers[gameId][player2].shipsPlaced) {
            emit BothPlayersPlacedShips(gameId, true);
        }
    }

    /// @notice Make a move by specifying coordinates (x, y).
    /// The coordinates are encoded using the same formula (x * 10 + y) and then checked against the opponent's ship mapping.
    function move(uint8 x, uint8 y) public {
        require(!gameOver, "Game is over");
        require(msg.sender == whoseTurn, "Not your turn");
        require(x < 10 && y < 10, "Coordinates out of range");
        require(player1 != address(0) && player2 != address(0), "Game not started, missing player");

        // Determine the opponent.
        address opponent = msg.sender == player1 ? player2 : player1;
        PlayerData storage opponentData = gamePlayers[gameId][opponent];
        uint8 pos = x * 10 + y;
        bool hit = false;

        // Check if the opponent has a ship at that position.
        if (opponentData.ships[pos]) {
            opponentData.ships[pos] = false;
            opponentData.remainingCells--;
            hit = true;
            if (opponentData.remainingCells == 0) {
                gameOver = true;
                emit GameOver(gameId, msg.sender);
            }
        }

        emit MoveResult(gameId, msg.sender, hit, pos);

        if (!gameOver) {
            whoseTurn = opponent;
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
        whoseTurn = address(0);
        gameOver = false;
        gameId++;  // Increment gameId for the new game session.
        emit GameReset(gameId);
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Battleship {
    address public player1;
    address public player2;
    bool public gameOver;
    address public whoseTurn;

    // Each player's data. Instead of a full grid, we only store the ship positions.
    struct PlayerData {
        // Mapping from an encoded cell (0 to 99) to a bool indicating whether a ship exists there.
        // When a ship is hit, the mapping value is set to false.
        mapping(uint8 => bool) ships;
        uint8 remainingCells;
        // To prevent placing ships more than once.
        bool shipsPlaced;
    }

    mapping(address => PlayerData) private players;

    // Events to inform off-chain listeners about game state changes.
    event PlayerJoined(address indexed player);
    event GameStarted(bool started);
    event ShipPlacement(address indexed player, uint8[] positions);
    event BothPlayersPlacedShips(bool placed);
    event MoveResult(address indexed player, bool hit, uint8 pos);
    event GameOver(address winner);
    event GameReset(bool reset);

    /// @notice Join the game. The first caller becomes player1; the second becomes player2.
    function join() public {
        require(player1 == address(0) || player2 == address(0), "Game already has 2 players");

        if (player1 == address(0)) {
            player1 = msg.sender;
            emit PlayerJoined(player1);
        } else {
            require(msg.sender != player1, "Already joined as player1");
            player2 = msg.sender;
            // Start the game once both players have joined.
            whoseTurn = player1;
            gameOver = false;
            emit GameStarted(true);
        }
    }

    /// @notice Place your ships by providing an array of encoded positions.
    /// Each position is a number between 0 and 99 (calculated as row * 10 + col).
    /// For example, a ship cell at (3, 1) is encoded as 31.
    function placeShips(uint8[] calldata positions) public {
        require(msg.sender == player1 || msg.sender == player2, "Only players can place ships");
        PlayerData storage pd = players[msg.sender];
        require(!pd.shipsPlaced, "Ships have already been placed");
        require(positions.length > 0, "No ship positions provided");

        for (uint i = 0; i < positions.length; i++) {
            uint8 pos = positions[i];
            require(pos < 100, "Position out of range");
            // Prevent duplicate positions.
            require(!pd.ships[pos], "Duplicate position provided");
            pd.ships[pos] = true;
        }
        // Set the remaining cell count to the number of positions provided.
        pd.remainingCells = uint8(positions.length);
        pd.shipsPlaced = true;
        emit ShipPlacement(msg.sender, positions);

        // Check if both players have placed their ships.
        if (players[player1].shipsPlaced && players[player2].shipsPlaced) {
            emit BothPlayersPlacedShips(true);
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
        PlayerData storage opponentData = players[opponent];

        // Encode the move coordinates.
        uint8 pos = x * 10 + y;
        bool hit = false;

        // Check if the opponent has a ship at that position.
        if (opponentData.ships[pos]) {
            // Mark the cell as hit by setting the mapping value to false.
            opponentData.ships[pos] = false;
            opponentData.remainingCells--;
            hit = true;

            // If no intact ship cells remain, the game is over.
            if (opponentData.remainingCells == 0) {
                gameOver = true;
                emit GameOver(msg.sender);
            }
        }

        // Your own address
        emit MoveResult(msg.sender, hit, pos);

        // Switch turns if the game is not over.
        if (!gameOver) {
            whoseTurn = opponent;
        }
    }

    function resetGame() public {
        // Save current player addresses locally.
        address _player1 = player1;
        address _player2 = player2;
        // Delete data
        if (_player1 != address(0)) {
            delete players[_player1];
        }
        if (_player2 != address(0)) {
            delete players[_player2];
        }
        player1 = address(0);
        player2 = address(0);
        whoseTurn = address(0);

        emit GameReset(true);
    }
}
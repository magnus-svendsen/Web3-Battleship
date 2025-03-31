// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SinglePlayerBattleship {
    // The address of the player
    address public player;
    // Game state flag
    bool public gameOver;

    // ---------------------------
    // Player's board
    // ---------------------------
    // Bitmask for player's ship placements (cells 0–99)
    uint256 public playerShips;
    // Number of ship cells remaining on the player's board
    uint8 public playerRemainingCells;
    // Flag indicating whether the player has placed their ships
    bool public playerShipsPlaced;

    // ---------------------------
    // AI board
    // ---------------------------
    // Bitmask for AI ship placements (cells 0–99)
    uint256 public aiShips;
    // Number of ship cells remaining on the AI board
    uint8 public aiRemainingCells;
    // Nonce for randomness
    uint256 public aiMoves; // Bitmask for AI moves (cells 0–99)
    uint256 private nonce;

    // ---------------------------
    // Events
    // ---------------------------
    event PlayerJoined(address indexed player);
    event ShipPlacement(address indexed player);
    event MoveResult(
        address indexed player,
        bool hit,
        uint8 pos,
        bool gameOver,
        bool isPlayerMove
    );
    event GameReset();

    constructor() {
        // Generate AI board using five ships of sizes: 5, 4, 3, 3, and 2.
        aiShips = 0;
        // Ship 1 (size 5): positions 11, 12, 13, 14, 15
        aiShips |= (1 << 11) | (1 << 12) | (1 << 13) | (1 << 14) | (1 << 15);
        // Ship 2 (size 4): positions 35, 36, 37, 38
        aiShips |= (1 << 35) | (1 << 36) | (1 << 37) | (1 << 38);
        // Ship 3 (size 3): positions 65, 66, 67
        aiShips |= (1 << 65) | (1 << 66) | (1 << 67);
        // Ship 4 (size 3): positions 75, 76, 77
        aiShips |= (1 << 75) | (1 << 76) | (1 << 77);
        // Ship 5 (size 2): positions 90, 91
        aiShips |= (1 << 90) | (1 << 91);
        aiRemainingCells = 5 + 4 + 3 + 3 + 2; // 17 total cells

        gameOver = false;
    }

    /// @notice Player joins the game.
    function startGame() public {
        require(player == address(0), "Player already joined");
        player = msg.sender;
        emit PlayerJoined(player);
    }

    /// @notice Player places their ships by providing an array of encoded positions.
    /// Each position is a number between 0 and 99 (calculated as row * 10 + col).
    function placeShips(uint8[] calldata positions) public {
        require(!playerShipsPlaced, "Ships already placed");
        require(positions.length > 0, "No positions provided");

        for (uint i = 0; i < positions.length; i++) {
            uint8 pos = positions[i];
            require(pos < 100, "Position out of range");
            // Check for duplicate placements using the bitmask.
            require(
                (playerShips & (1 << pos)) == 0,
                "Duplicate position provided"
            );
            playerShips |= (1 << pos);
        }
        // Set remaining cells based on number of positions provided.
        playerRemainingCells = uint8(positions.length);
        playerShipsPlaced = true;
        emit ShipPlacement(player);
    }

    /// @notice Player fires a move at the AI board.
    /// Coordinates are encoded as (x * 10 + y).
    function move(uint8 x, uint8 y) public {
        require(!gameOver, "Game is over");
        require(player != address(0), "Game not started");
        require(x < 10 && y < 10, "Coordinates out of range");

        uint8 pos = x * 10 + y;
        bool hit = false;
        if ((aiShips & (1 << pos)) != 0) {
            hit = true;
            aiShips &= ~(1 << pos);
            aiRemainingCells--;
            if (aiRemainingCells == 0) {
                gameOver = true;
            }
        }
        emit MoveResult(player, hit, pos, gameOver, true);
    }

    function aiMove() public {
        require(player != address(0), "No player");
        require(!gameOver, "Game is over");

        /* 
        * To determine a target cell, we generate a pseudo-random number between 0 and 99.
        * We do this by incrementing a nonce and hashing it along with the current block timestamp
        * and difficulty. This ensures that each call produces a different number.
        */
        nonce++;
        uint8 pos = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, block.difficulty, nonce)
                )
            ) % 100
        );

        // If this position has already been shot, keep generating a new one.
        while ((aiMoves & (1 << pos)) != 0) {
            nonce++;
            pos = uint8(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            block.timestamp,
                            block.difficulty,
                            nonce
                        )
                    )
                ) % 100
            );
        }
        // Mark this cell as shot.
        aiMoves |= (1 << pos);

        bool hit = false;
        // Check if the position contains a player's ship.
        if ((playerShips & (1 << pos)) != 0) {
            hit = true;
            // Remove the hit ship cell.
            playerShips &= ~(1 << pos);
            playerRemainingCells--;
            if (playerRemainingCells == 0) {
                gameOver = true;
            }
        }
        emit MoveResult(player, hit, pos, gameOver, false);
    }

    /// @notice Resets the game state for a new session.
    /// The player can re-place their ships by providing a new bitmask and remaining cells.
    function resetGame() public {
        player = address(0);
        playerShipsPlaced = false;
        playerShips = 0;
        playerRemainingCells = 0;

        // Reset the AI board to its initial configuration.
        aiShips = 0;
        aiShips |= (1 << 11) | (1 << 12) | (1 << 13) | (1 << 14) | (1 << 15); // 5 cells
        aiShips |= (1 << 35) | (1 << 36) | (1 << 37) | (1 << 38); // 4 cells
        aiShips |= (1 << 65) | (1 << 66) | (1 << 67); // 3 cells
        aiShips |= (1 << 75) | (1 << 76) | (1 << 77); // 3 cells
        aiShips |= (1 << 90) | (1 << 91); // 2 cells
        aiRemainingCells = 5 + 4 + 3 + 3 + 2; // 17 cells total

        gameOver = false;
        emit GameReset();
    }
}

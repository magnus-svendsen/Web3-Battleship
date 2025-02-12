const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Battleship", () => {
    let Battleship;
    let battleship;
    let player1;
    let player2;

    beforeEach(async () => {
        Battleship = await ethers.getContractFactory("Battleship");
        [player1, player2] = await ethers.getSigners();
        battleship = await Battleship.deploy();
        await battleship.deployed();
    });

    /*

    it("should measure gas cost of join function", async () => {
        // Initialize game state
        const playerData = {
            shipsRemaining: 1,
            grid: [
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };

        const ship = {
            length: 1,
            timesHit: 0,
            isDestroyed: false,
            coordinates: [[0, 0]]
        };

        // Measure gas cost of join function for player1
        const tx1 = await battleship.connect(player1).join(playerData, [ship]);
        const receipt1 = await tx1.wait();
        console.log("Gas used for join (player1):", receipt1.gasUsed.toString());

        // Measure gas cost of join function for player2
        const tx2 = await battleship.connect(player2).join(playerData, [ship]);
        const receipt2 = await tx2.wait();
        console.log("Gas used for join (player2):", receipt2.gasUsed.toString());
    });

    it("should measure gas cost of move function", async () => {
        // Initialize game state
        const playerData = {
            shipsRemaining: 2,
            grid: [
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };

        const ship = {
            length: 1,
            timesHit: 0,
            isDestroyed: false,
            coordinates: [[0, 0]]
        };

        await battleship.connect(player1).join(playerData, [ship]);
        await battleship.connect(player2).join(playerData, [ship]);

        // Measure gas cost of move function
        const tx = await battleship.connect(player1).move(0, 0);
        const receipt = await tx.wait();
        console.log("Gas used for move:", receipt.gasUsed.toString());
    });

    */

    it("should correctly update the grid when a ship is hit and finish the game", async () => {
      // Initialize game state for both players
      const grid1 = [
          [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
  
      const grid2 = [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
  
      await battleship.connect(player1).join(grid1);
      await battleship.connect(player2).join(grid2);
  
      // Player1 makes moves to hit the ships
      await battleship.connect(player1).move(9, 0);
      const player2HitsReceived = await battleship.getHitsReceived(player2.address);
      console.log("Hits received for player 2:", player2HitsReceived);
  

      /*
      await battleship.connect(player2).move(0, 0);
      await battleship.connect(player1).move(9, 1);



      // Fetch the updated grid for player2
      const updatedGrid1 = await battleship.getGrid(player1.address);
      const updatedGrid2 = await battleship.getGrid(player2.address);
      console.log("Updated grid for player1:", updatedGrid1);
      console.log("Updated grid for player2:", updatedGrid2);
  
      // Check that the grid is updated correctly
      expect(updatedGrid2[9][0]).to.equal(3);
      expect(updatedGrid1[0][0]).to.equal(3);
      expect(updatedGrid2[9][1]).to.equal(3);

      // Fetch the updated hit count for player2
      const player2HitCount = await battleship.getHitCount(player1.address);
      console.log("Hit count for player2:", player2HitCount);

      // Check that the hit count is updated correctly
      expect(player2HitCount).to.equal(1);
      
      // Check that the game is over
      //const gameOver = await battleship.getGameOver();
      //expect(gameOver).to.be.true;
      */
  });
});
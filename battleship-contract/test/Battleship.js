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

        await battleship.connect(player1).join(playerData, [ship]);
        await battleship.connect(player2).join(playerData, [ship]);

        // Measure gas cost of move function
        const tx = await battleship.connect(player1).move(0, 0);
        const receipt = await tx.wait();
        console.log("Gas used for move:", receipt.gasUsed.toString());
    });
});
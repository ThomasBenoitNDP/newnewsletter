// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");


async function main() {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.

    // Constructor parameters
    const _name = "DevLetter2";
    const _symbol = "DV_SYMBOL";

    console.log("Before : hre.ethers.getSigners()");
    // Contracts are deployed using the first signer/account by default
    const [_owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1] = await hre.ethers.getSigners();

    console.log("_owner = ",_owner.address);
    const Newnesletter = await hre.ethers.getContractFactory("newnewsletter");
    const newnewsletter = await Newnesletter.deploy(_author.address, _name, _symbol);

    console.log("author :", _author.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

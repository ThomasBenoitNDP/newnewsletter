const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("newnewsletter", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.

    /* Step 0 : Deployment Phase */ 
    async function deployNewNewsLetter() {
        // Constructor parameters 
        const _name = "DevLetter2";
        const _symbol = "DV_SYMBOL";

        // Contracts are deployed using the first signer/account by default
        const [_owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1] = await ethers.getSigners();

        const Newnesletter = await ethers.getContractFactory("newnewsletter");
        const newnewsletter = await Newnesletter.deploy(_author, _name, _symbol);

        console.log("author :", _author)
        return { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1 };
    }

    /* 
    *   T.0 : tests de déploiement
    */
    describe("### T.0 : Deployment", function () {
        
        it("-> T.0.0 : Should set the right owner", async function () {
            const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
      
            expect(await newnewsletter._owner()).to.equal(_owner);
          });

         

        it("-> T.0.1 : Should set the right author", async function () {
            const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
      
            expect(await newnewsletter._author()).to.equal(_author);
          });

        /*
        it("-> T.0.2 : Should set the right name", async function () {
            const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
      
            expect(await newnewsletter._name()).to.equal(_name);
          });

        it("-> T.0.3 : Should set the right symbol", async function () {
            const {newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
      
            expect(await newnewsletter._symbol()).to.equal(_symbol);
          });
        
        */
       
        it("-> T.0.4 : Should set the right  _MaxGuests", async function () {
            const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
      
            expect(await newnewsletter. _MaxGuests()).to.equal(2);
          });
        
        it("-> T.0.5 : Should emit an event on OwnerSet", async function () {
            const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
    
            await expect()
              .to.emit(newnewsletter, "OwnerSet")
              .withArgs(ethers.constants.AddressZero, _owner); 
          });
    
        it("-> T.0.6 : Should emit an event on AuthorSet", async function () {
            const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1 } = await loadFixture(deployNewNewsLetter);
    
            await expect()
              .to.emit(newnewsletter, "AuthorSet")
              .withArgs(ethers.constants.AddressZero, _author); 
          });

          

    })

  
  })
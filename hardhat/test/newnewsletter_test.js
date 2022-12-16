//import "hardhat/console.sol";


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
        const newnewsletter = await Newnesletter.deploy(_author.address, _name, _symbol);

        //console.log("author :", _author)
        return { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1 };
    }


    
    /*   T.0 : tests de déploiement
    */
    describe("### T.0 : Deployment", function () {
        
        it("-> T.0.0 : Should set the right owner", async function () {
            const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
      
            expect(await newnewsletter.getOwner()).to.equal(_owner.address);
          });

         

        it("-> T.0.1 : Should set the right author", async function () {
            const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
      
            expect(await newnewsletter.getAuthor()).to.equal(_author.address);
          });

        
       
        it("-> T.0.4 : Should set the right  _MaxGuests", async function () {
            const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
      
            expect(await newnewsletter.getMaxGuests()).to.equal(2);
          });
        
	/*
        it("-> T.0.5 : Should emit an event on OwnerSet", async function () {
            const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
    
            await expect()
              .to.emit(newnewsletter, "OwnerSet")
              .withArgs(ethers.constants.AddressZero, _owner.address); 
          });
    
        it("-> T.0.6 : Should emit an event on AuthorSet", async function () {
            const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1 } = await loadFixture(deployNewNewsLetter);
    
            await expect(newnewsletter.e())
              .to.emit(newnewsletter, "AuthorSet")
              .withArgs(ethers.constants.AddressZero, _author.address); 
          });*/

    })

    /* 
    *   T.1 : Subscribe FIAT WAY 
    */
    describe("### T.1 : Subscribe to a news Letter - Fiat Way ", function () {
      it("-> T.1.0 : Subscriber receives a NFT ", async function () {
        const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

        const tokenId = 45;
        await newnewsletter.subscribe_fiatWay(subscriber.address, tokenId);

        // 0. Positive Balance 
        expect(await newnewsletter.balanceOf(subscriber.address)).to.equal(1);

        // 1. Number of Guest = 0
        expect(await newnewsletter.get_numberOfguests(tokenId)).to.equal(0);

        // 2. It is indicated that a subcriber could not be a guest 
        expect(await newnewsletter.get_tokenIdHost(subscriber.address)).to.equal(tokenId);
      });

      it("-> T.1.1 : Emit the event  newSubscriber_fiatWay(subscriber_, tokenId_)", async function () {
        const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

        const tokenId = 45;

        await expect(newnewsletter.subscribe_fiatWay(subscriber.address, tokenId))
          .to.emit(newnewsletter, "newSubscriber_fiatWay")
          .withArgs(subscriber.address, tokenId);

      });

      // On ne peut pas miner deux tokenId identiques 
      it("-> T.1.2 : Should Reverted : Not possible to subscribe to similar TOKEN ", async function () {
        const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

        const tokenId = 45;
        await newnewsletter.subscribe_fiatWay(subscriber.address, tokenId);

        await expect(newnewsletter.subscribe_fiatWay(guest_1.address, tokenId)).to.be.revertedWith("ERC721: token already minted");
    });

    // Un subscriber ne peut pas souscrire à deux évènements en même temps 
    it("-> T.1.3 : Should Reverted : Not possible to subscribe to more than 1 subcription at the same time ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

      const tokenId = 45;
      const tokenId_2 = 46;
      await newnewsletter.subscribe_fiatWay(subscriber.address, tokenId);

      await expect( newnewsletter.subscribe_fiatWay(subscriber.address, tokenId_2)).to.be.revertedWith("This user can not have 2 active subscriotions simultaneously");
  });

  })


    /* 
    *   T.2 : Subscribe Crypot WAY 
    */
    describe("### T.2 : Subscribe to a news Letter - Crypto Way ", function () {
      it("-> T.2.0 : Subscriber receives a NFT ", async function () {
        const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

        // Initiliaze Ether Value 
        const subAmount = "1.0";

        // Initialize token
        const tokenId = 45;
        
        const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
        await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId, {value: ethers.utils.parseEther(subAmount)});

        // 0. Positive Balance 
        expect(await newnewsletter.balanceOf(subscriber.address)).to.equal(1);

        // 1. Number of Guest = 0
        expect(await newnewsletter.get_numberOfguests(tokenId)).to.equal(0);

        // 2. It is indicated that a subcriber could not be a guest 
        expect(await newnewsletter.get_tokenIdHost(subscriber.address)).to.equal(tokenId);
        
      });

      it("-> T.2.1 : Pay the contract owner", async function () {
        const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

        const tokenId = 45;
        const subAmount = "1.0";

        const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
       ;

        await expect( await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId, {value: ethers.utils.parseEther(subAmount)}))
          .to.changeEtherBalances([subscriber.address, _owner.address], [ethers.utils.parseEther("-1.0"), ethers.utils.parseEther("0.2")]);
      });

      it("-> T.2.2 : Pay the author and the owner ", async function () {
        const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

        const tokenId = 45;
        const subAmount = "1.0";

        const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
       ;

       await expect( await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId, {value: ethers.utils.parseEther(subAmount)}))
       .to.changeEtherBalances([subscriber.address, _author.address, _owner.address], [ethers.utils.parseEther("-1.0"), ethers.utils.parseEther("0.8"),ethers.utils.parseEther("0.2")]);

      });


      // On ne peut pas miner deux tokenId identiques 
      it("-> T.2.3 : Should Reverted : Not possible to subscribe to similar TOKEN ", async function () {
        const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

        const tokenId = 45;
        const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
        await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId);

        const newnewsletter_cryptoWay_2 = await newnewsletter.connect(guest_1);
        await expect( newnewsletter_cryptoWay_2.subscribe_cryptoWay(tokenId)).to.be.revertedWith("ERC721: token already minted");
    });

    // Un subscriber ne peut pas souscrire à deux évènements en même temps 
    it("-> T.2.4 : Should Reverted : Not possible to subscribe to more than 1 subcription at the same time ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

      const tokenId = 45;
      const tokenId_2 = 46;
      const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
      await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId);

      await expect( newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId_2)).to.be.revertedWith("This user can not have 2 active subscriotions simultaneously");
  });

  })


})

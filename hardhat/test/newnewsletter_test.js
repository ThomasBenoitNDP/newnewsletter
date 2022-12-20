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


  /*
  * Test 3 : authorizesGuest
  */
  describe("### T.3 : authorizeGuest ", function () {

    // 3.1 L'utilisateur devient un guest du subscriber
    it("-> T.3.1 : a user become a guest of a subscriber ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

      // Step 0 : a user subscribes
      const tokenId = 45;
      const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
      await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId);

      // Step 1 : the subscriber authorize a guest 
      await newnewsletter_cryptoWay.authorizesGuest(tokenId, guest_1.address);

      expect( await newnewsletter_cryptoWay.get_tokenAuthorisations(guest_1.address)).to.equal(tokenId)
      expect( await newnewsletter_cryptoWay.get_numberOfguests(tokenId)).to.equal(1)

    })

    // 3.2 : the event is emmitted guestInvitation(guest_, msg.sender, tokenId_)
    it("-> T.3.2 : guestInvitation event is emitted ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

      // Step 0 : a user subscribes
      const tokenId = 45;
      const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
      await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId);

      await expect(await newnewsletter_cryptoWay.authorizesGuest(tokenId, guest_1.address))
      .to.emit(newnewsletter, "guestInvitation")
      .withArgs(guest_1.address, tokenId, 1);


    })

    // 3.3 Guest has no current subscription
    it("-> T.3.3 : Guest has no current subscription ", async function () {
       const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
    
       // Step 0 : a user subscribes
       const tokenId = 45;
       const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
       await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId);
    
       // Step 1 : guest subscribes to 
       const tokenId_guest = 46;
       const newnewsletter_cryptoWay_guest = await newnewsletter.connect(guest_1);
       await newnewsletter_cryptoWay_guest.subscribe_cryptoWay(tokenId_guest);
    
       await expect( newnewsletter_cryptoWay.authorizesGuest(tokenId, guest_1.address)).to.be.revertedWith("This user can not be a guest");
    
    })

    // 3.4 Subscriber owns the token
    it("-> T.3.4 : Subscriber owns the token ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
   
      // Step 0 : a user subscribes
      const tokenId = 45;
      const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
      await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId);

      // Step 1 : an other user subscribe 
      const tokenId_2 = 46;
      const newnewsletter_cryptoWay_guest_1 = await newnewsletter.connect(guest_1);
      await newnewsletter_cryptoWay_guest_1.subscribe_cryptoWay(tokenId_2);
   
      await expect( newnewsletter_cryptoWay.authorizesGuest(tokenId_2, guest_2.address)).to.be.revertedWith("Caller is not owner nor approved");
   
   })

    // 3.5 No more than _MaxGuests guests
    it("-> T.3.5 : No more than _MaxGuests guests", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
   
      // Step 0 : a user subscribes
      const tokenId = 45;
      const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
      await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId);

      const MaxGuests = await newnewsletter_cryptoWay.getMaxGuests()

      // authorize guest_1
      newnewsletter_cryptoWay.authorizesGuest(tokenId, guest_1.address)
      
      // authorize guest_2
      newnewsletter_cryptoWay.authorizesGuest(tokenId, guest_2.address)
   
      // authorize guest_3
      await expect( newnewsletter_cryptoWay.authorizesGuest(tokenId, guest_3.address)).to.be.revertedWith("you can not add new guests to your susbscription !");
   
   })

   // 3.6 Guest has never been subscribed 
   it("-> T.3.6 : Guest has never been subscribed ", async function () {
    const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
 
    // Step 0 : guest subcribes 
    const tokenId_1 = 45;
    const newnewsletter_cryptoWay_guest_1 = await newnewsletter.connect(guest_1);
    await newnewsletter_cryptoWay_guest_1.subscribe_cryptoWay(tokenId_1);

    // Step 1 : guest cancels his subscription 
    await newnewsletter_cryptoWay_guest_1.cancelSubscription(tokenId_1);

    // Step 2 : a user subscribe 
    const tokenId_2 = 46;
    const newnewsletter_cryptoWay_subscriber = await newnewsletter.connect(subscriber);
    await newnewsletter_cryptoWay_subscriber.subscribe_cryptoWay(tokenId_2);

    // Step 3 : subscriber authorize guest 
    await expect( newnewsletter_cryptoWay_subscriber.authorizesGuest(tokenId_2, guest_1.address)).to.be.revertedWith("This user can not be a guest");
 
 })

   // 3.7 Guest has never been a guest 
   it("-> T.3.7 : Guest has never been a guest ", async function () {
    const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);
 
    // Step 0 : subscriber1 subcribes 
    const tokenId_1 = 45;
    const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
    await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId_1);

    // Step 1 : subscriber1 authorize guest_1
    await newnewsletter_cryptoWay.authorizesGuest(tokenId_1, guest_1.address)

    // Step 2 : subscriber2 subcribes 
    const tokenId_2 = 46;
    const newnewsletter_cryptoWay_guest_2 = await newnewsletter.connect(guest_2);
    await newnewsletter_cryptoWay_guest_2.subscribe_cryptoWay(tokenId_2);

    // Step 3 : subscriber2 authorize guest1 
    await expect( newnewsletter_cryptoWay_guest_2.authorizesGuest(tokenId_2, guest_1.address)).to.be.revertedWith("This guest has already been associated to a token");
 
 })


  })

  /*
  * Test 4 : becomeGuest_fiatWay
  */
    describe("### T.4 : becomeGuest_fiatWay ", function () {
      // 4.1 a user accepts to be a guest
      it("-> T.4.1 : a user accepts to be a guest ", async function () {
        const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

      // Step 0 : subscriber1 subcribes 
      const tokenId_1 = 45;
      //
      await newnewsletter.subscribe_fiatWay(subscriber.address, tokenId_1);


      // Step 1 : subscriber1 authorize guest_1
      const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
      await newnewsletter_cryptoWay.authorizesGuest(tokenId_1, guest_1.address)

      // Step 2 : guest accepts the invitation 
      await newnewsletter.becomeGuest_fiatWay(guest_1.address, tokenId_1);

      expect(await newnewsletter_cryptoWay.get_tokenIdHost(guest_1.address)).to.equal(tokenId_1)
      })
  
     // 4.2 guestSet_fiatWay was emited 
     it("-> T.4.2 : guestSet_fiatWay is emitted ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

      // Step 0 : subscriber1 subcribes 
      const tokenId_1 = 45;
      await newnewsletter.subscribe_fiatWay(subscriber.address, tokenId_1);

      // Step 1 : subscriber1 authorize guest_1
      const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
      await newnewsletter_cryptoWay.authorizesGuest(tokenId_1, guest_1.address)

      // Step 2 : guest accepts the invitation 
      await expect(await newnewsletter.becomeGuest_fiatWay(guest_1.address, tokenId_1))
      .to.emit(newnewsletter, "guestSet_fiatWay")
      .withArgs(guest_1.address, tokenId_1, 1);
     })

    // 4.3. Host has authorized this user to be his guest 
    it("-> T.4.3 : If a guest is not authorized, he could not be guest  ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

      // Step 0 : subscriber1 subcribes 
      const tokenId_1 = 45;
      await newnewsletter.subscribe_fiatWay(subscriber.address, tokenId_1);

      // Step 2 a user attempts to become a guest without authorization 
      await expect( newnewsletter.becomeGuest_fiatWay(guest_1.address, tokenId_1)).to.be.revertedWith("No one authorizes you to be a guest");


    })

    it("-> T.4.4 : If a subscriber authorized a guest, the guest could not be the guest of another user ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

      // Step 0 : subscriber1 subcribes 
      const tokenId_1 = 45;
      await newnewsletter.subscribe_fiatWay(subscriber.address, tokenId_1);

      // Step 1 : subscriber2 subcribes 
      const tokenId_2 = 46;
      await newnewsletter.subscribe_fiatWay(guest_1.address, tokenId_2);


      // Step 2 : subscriber2 authorizes a guest 
      const newnewsletter_cryptoWay = await newnewsletter.connect(guest_1);
      await newnewsletter_cryptoWay.authorizesGuest(tokenId_2, guest_2.address)

      // Step 3 : The guest attempt to be guest of subscriber 1
      await expect( newnewsletter.becomeGuest_fiatWay(guest_2.address, tokenId_1)).to.be.revertedWith("No one authorizes you to be a guest");


    })

    it("-> T.4.5 : user attempts to become a guest twice ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

      // Step 0 : subscriber1 subcribes 
      const tokenId_1 = 45;
      await newnewsletter.subscribe_fiatWay(subscriber.address, tokenId_1);

      // Step 1 : subscriber1 authorize guest_1
      const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
      await newnewsletter_cryptoWay.authorizesGuest(tokenId_1, guest_1.address)

      // Step 2 : guest accepts the invitation 
      await newnewsletter.becomeGuest_fiatWay(guest_1.address, tokenId_1);

      // Step 3 : the guest attempt to become a guest 
      await expect( newnewsletter.becomeGuest_fiatWay(guest_1.address, tokenId_1)).to.be.revertedWith("This guest has already been associated to a token");

    })
    
    it("-> T.4.6 : user attempts to become a guest of another user  ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

      // Step 0 : subscriber1 and subscriber2 subcribes 
      const tokenId_1 = 45;
      await newnewsletter.subscribe_fiatWay(subscriber.address, tokenId_1);

      const tokenId_2 = 46;
      await newnewsletter.subscribe_fiatWay(guest_2.address, tokenId_2);

      // Step 1 : subscriber1 authorize guest_1
      const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
      await newnewsletter_cryptoWay.authorizesGuest(tokenId_1, guest_1.address)

      // Step 2 : guest accepts the invitation 
      await newnewsletter.becomeGuest_fiatWay(guest_1.address, tokenId_1);

      // Step 3 : the guest attempt to become a guest 
      await expect( newnewsletter.becomeGuest_fiatWay(guest_1.address, tokenId_2)).to.be.revertedWith("No one authorizes you to be a guest");

    })
    
    it("-> T.4.7 : user attempts to become a guest after subscribing ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

      // Step 0 : subscriber1 subcribes 
      const tokenId_1 = 45;
      await newnewsletter.subscribe_fiatWay(subscriber.address, tokenId_1);

      // Step 1 : subscriber1 authorize guest_1
      const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
      await newnewsletter_cryptoWay.authorizesGuest(tokenId_1, guest_1.address)

      // Step 2 : guest accepts the invitation 
      await newnewsletter.becomeGuest_fiatWay(guest_1.address, tokenId_1);

      // Step 0 : subscriber1 subcribes 
      const tokenId_2 = 46;
      await newnewsletter.subscribe_fiatWay(guest_1.address, tokenId_2);

      // Step 3 : the guest attempt to become a guest 
      await expect( newnewsletter.becomeGuest_fiatWay(guest_1.address, tokenId_1)).to.be.revertedWith("This guest has already been associated to a token");

    })

  })


  /*
  * Test 5 : becomeGuest_cryptoway
  */
  describe("### T.5 : becomeGuest_cryptoway", function () {
    it("-> T.5.1 : a user accepts to be a guest ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

    // Step 0 : subscriber1 subcribes 
    const tokenId_1 = 45;
    const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
    await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId_1);


    // Step 1 : subscriber1 authorize guest_1
    await newnewsletter_cryptoWay.authorizesGuest(tokenId_1, guest_1.address)

    // Step 2 : guest accepts the invitation 
    const newnewsletter_cryptoWay_guest = await newnewsletter.connect(guest_1);
    await  newnewsletter_cryptoWay_guest.becomeGuest_cryptoWay(tokenId_1);

    expect(await newnewsletter_cryptoWay_guest.get_tokenIdHost(guest_1.address)).to.equal(tokenId_1)
    })

   // 5.2 guestSet_fiatWay was emited 
   it("-> T.5.2 : guestSet_cryptoWay is emitted ", async function () {
    const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

    // Step 0 : subscriber1 subcribes 
    const tokenId_1 = 45;
    const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
    await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId_1);

    // Step 1 : subscriber1 authorize guest_1
    await newnewsletter_cryptoWay.authorizesGuest(tokenId_1, guest_1.address)

    // Step 2 : guest accepts the invitation 
    const newnewsletter_cryptoWay_guest = await newnewsletter.connect(guest_1);

    await expect(await newnewsletter_cryptoWay_guest.becomeGuest_cryptoWay(tokenId_1))
    .to.emit(newnewsletter_cryptoWay_guest, "guestSet_cryptoWay")
    .withArgs(guest_1.address, tokenId_1, 1);
   })

  it("-> T.5.3 : test crypto transfer ", async function () {
    const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

    // Step 0 : subscriber1 subcribes 
    const subAmount = "1.0";
    const tokenId_1 = 45;
    const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
    await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId_1);


    // Step 1 : subscriber1 authorize guest_1
    await newnewsletter_cryptoWay.authorizesGuest(tokenId_1, guest_1.address)

    // Step 2 : guest accepts the invitation 
    const newnewsletter_cryptoWay_guest = await newnewsletter.connect(guest_1);

    await expect( await  newnewsletter_cryptoWay_guest.becomeGuest_cryptoWay(tokenId_1, {value: ethers.utils.parseEther(subAmount)}))
    .to.changeEtherBalances([guest_1.address, subscriber.address, _author.address, _owner.address], [ethers.utils.parseEther("-1.0"), ethers.utils.parseEther("0.3"), ethers.utils.parseEther("0.5"), ethers.utils.parseEther("0.2")]);

  })

  
  // 5.3. Host has authorized this user to be his guest 
  it("-> T.5.4 : If a guest is not authorized, he could not be guest  ", async function () {
    const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

    // Step 0 : subscriber1 subcribes 
    const tokenId_1 = 45;
    const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
    await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId_1);

    // Step 2 : guest accepts the invitation 
    const newnewsletter_cryptoWay_guest = await newnewsletter.connect(guest_1);

    // Step 2 a user attempts to become a guest without authorization 
    await expect( newnewsletter_cryptoWay_guest.becomeGuest_cryptoWay(tokenId_1)).to.be.revertedWith("No one authorizes you to be a guest");


  })

  it("-> T.5.5 : If a subscriber authorized a guest, the guest could not be the guest of another user ", async function () {
    const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

    // Step 0 : subscriber1 subcribes 
    const tokenId_1 = 45;
    const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
    await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId_1);

    // Step 1 : subscriber2 subcribes 
    const tokenId_2 = 46;
    const newnewsletter_cryptoWay_sub2 = await newnewsletter.connect(guest_1);
    await newnewsletter_cryptoWay_sub2.subscribe_cryptoWay(tokenId_2);


    // Step 2 : subscriber2 authorizes a guest 
    await newnewsletter_cryptoWay_sub2 .authorizesGuest(tokenId_2, guest_2.address)

    // Step 3 : The guest attempt to be guest of subscriber 1
    const newnewsletter_cryptoWay_guest = await newnewsletter.connect(guest_2);
    await expect( newnewsletter_cryptoWay_guest.becomeGuest_cryptoWay(tokenId_1)).to.be.revertedWith("No one authorizes you to be a guest");

  })


  it("-> T.5.6 : user attempts to become a guest twice ", async function () {
    const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

    // Step 0 : subscriber1 subcribes 
    const tokenId_1 = 45;
    const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
    await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId_1);

    // Step 1 : subscriber1 authorize guest_1
    await newnewsletter_cryptoWay.authorizesGuest(tokenId_1, guest_1.address)

    // Step 2 : guest accepts the invitation 
    const newnewsletter_cryptoWay_guest = await newnewsletter.connect(guest_1);
    await  newnewsletter_cryptoWay_guest.becomeGuest_cryptoWay(tokenId_1);

    // Step 3 : the guest attempt to become a guest 
    await expect(  newnewsletter_cryptoWay_guest.becomeGuest_cryptoWay(tokenId_1)).to.be.revertedWith("This guest has already been associated to a token");

  })
  
  it("-> T.5.7 : user attempts to become a guest of another user  ", async function () {
    const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

    // Step 0 : subscriber1 subcribes 
    const tokenId_1 = 45;
    const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
    await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId_1);

    // Step 1 : subscriber2 subcribes 
    const tokenId_2 = 46;
    const newnewsletter_cryptoWay_sub2 = await newnewsletter.connect(guest_2);
    await newnewsletter_cryptoWay_sub2.subscribe_cryptoWay(tokenId_2);

    // Step 1 : subscriber1 authorize guest_1
    await newnewsletter_cryptoWay.authorizesGuest(tokenId_1, guest_1.address)

    // Step 2 : guest accepts the invitation 
    const newnewsletter_cryptoWay_guest = await newnewsletter.connect(guest_1);
    await newnewsletter_cryptoWay_guest .becomeGuest_cryptoWay(tokenId_1);

    // Step 3 : the guest attempt to become a guest 
    await expect( newnewsletter_cryptoWay_guest .becomeGuest_cryptoWay(tokenId_2)).to.be.revertedWith("No one authorizes you to be a guest");

  })
  
  it("-> T.5.8 : user attempts to become a guest after subscribing ", async function () {
    const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

    // Step 0 : subscriber1 subcribes 
    const tokenId_1 = 45;
    const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
    await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId_1);

    // Step 1 : subscriber1 authorize guest_1
    await newnewsletter_cryptoWay.authorizesGuest(tokenId_1, guest_1.address)

    // Step 2 : guest accepts the invitation 
    const newnewsletter_cryptoWay_guest = await newnewsletter.connect(guest_1);
    await newnewsletter_cryptoWay_guest.becomeGuest_cryptoWay(tokenId_1);

    // Step 0 : subscriber1 subcribes 
    const tokenId_2 = 46;
    await newnewsletter_cryptoWay_guest.subscribe_cryptoWay(tokenId_2);

    // Step 3 : the guest attempt to become a guest 
    await expect( newnewsletter_cryptoWay_guest.becomeGuest_cryptoWay(tokenId_1)).to.be.revertedWith("This guest has already been associated to a token");

  })

})

  /*
  * Test 6 : Transfer
  */
  describe("### T.6 : Transfer", function () {
    it("-> T.6.1 : Subscription is not transferable ", async function () {
      const { newnewsletter, _name, _symbol, _owner, _author, subscriber, guest_1, guest_2, guest_3, no_sub_1} = await loadFixture(deployNewNewsLetter);

      // Step 0 : subscriber1 subcribes 
      const tokenId_1 = 45;
      const newnewsletter_cryptoWay = await newnewsletter.connect(subscriber);
      await newnewsletter_cryptoWay.subscribe_cryptoWay(tokenId_1);

      // Step 1 : user attepts to transfer 
      await newnewsletter_cryptoWay.transferFrom(subscriber.address, guest_1.address, tokenId_1);

      // Transfer was blocked
      expect(await newnewsletter_cryptoWay.balanceOf(subscriber.address)).to.equal(1)
      expect(await newnewsletter_cryptoWay.balanceOf(guest_1.address)).to.equal(0)

    })

  })

})

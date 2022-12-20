// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./ERC5643.sol";

contract newnewsletter is ERC5643 {

    /* 0. Libraries */
    // counter : count guests per tokenId 
    using Counters for Counters.Counter;

    // SafeMath : perform math operations 
    using SafeMath for uint256;

    // compute the price to pay 

    /* A. [Global values]  
        This section includes : 
            - global values
            - global structures
            - global mappings
    */
    // the contract owner
    address private _owner;

    // the news letter's author
    address private _author;

    // Maxguests per Token 
    uint256 private _MaxGuests; 

    // Mapping guests to tokenId
    // -> uint256(0) if is a new guest
    // something is a guest or a Host 
    mapping(address => uint256) private _tokenIdHost;

    // Mapping number of guest to an Host
    mapping(uint256 => Counters.Counter)  private _numberOfguests;

    // Authorized guest 
    mapping(address => uint256) private _tokenAuthorisations;

    /* B. [Events] */
    // emit the owner of the contract 
    event OwnerSet(address indexed oldOwner_, address indexed newOwner_);

    // emit the author of the news letter
    event AuthorSet(address indexed oldOwner_, address indexed newOwner_);

    // emit the new guest of a token - payment in Fiat
    event guestSet_fiatWay(address indexed guest_, uint256 indexed tokenId_, uint256 indexed nbguests_);

    // emit the new guest of a token - payment in Crypto
    event guestSet_cryptoWay(address indexed guest_, uint256 indexed tokenId_, uint256 indexed nbguests_);


    // emit an invitation to a guest 
    event guestInvitation(address indexed guest_, uint256 indexed tokenId_, uint256 indexed currentNbGuests_);

    // emit a subscription | payment in Fiat
    event newSubscriber_fiatWay(address indexed subscriber_, uint256 indexed tokenId_);

    // emit a subscription | payment in crypto 
    event newSubscriber_cryptoWay(address indexed subscriber_, uint256 indexed tokenId_);


    /* C. [Modifiers] */
    // modifier to check if caller is owner
    modifier isOwner() {
        require(msg.sender == _owner, "Caller is not owner");
        _;
    }

    // modifier to check if caller is the author
    modifier isAuthor() {
        require(msg.sender == _author, "Caller is not author");
        _;
    }


    /* D. [Constructor] */
    constructor(address author_,string memory name_, string memory symbol_) ERC5643(name_, symbol_) {
        //console.log("Owner contract deployed by:", msg.sender);
        _owner = msg.sender; 
        _author = author_;
        _MaxGuests = 2;

        emit OwnerSet(address(0), _owner);
        emit AuthorSet(address(0), _author);
    }

    /* E. [Functions] */

        /* E.1 [Own Functions]*/

        /*
        @dev an Host authorise an user to become his guest. | called by an Host
        @params :
            - uint256 tokenId_ : the token subscription
            - address guest_ :  the user to invite as a guest 
        */
        function authorizesGuest(uint256 tokenId_, address guest_) external {
            /* Conditions */

            // 1. Guest has no current subscription
            require(balanceOf(guest_) <= 0, "This user can not be a guest");

            // 2. Sender owns the token
            require(_isApprovedOrOwner(msg.sender, tokenId_), "Caller is not owner nor approved");

            // 3. The token can have new guests
            uint256 currentNbGuests = _numberOfguests[tokenId_].current();
            require (currentNbGuests < _MaxGuests, "you can not add new guests to your susbscription !");
            
            // 4. Guest has never been subscribed or been a guest 
            require (_tokenAuthorisations[guest_] == 0, "This guest has already been associated to a token");

            /* Task */

            // Step 0 : let's authorize 
            _tokenAuthorisations[guest_] = tokenId_;

            // Step 1 : increment _numberOfguests
            _numberOfguests[tokenId_].increment() ; 
            currentNbGuests = _numberOfguests[tokenId_].current();

            // Step 2 : emit an event 
            emit guestInvitation(guest_, tokenId_,currentNbGuests);
        }

        /*
        * @dev Payment in Fiat : an user become a guest of subscription | Called by a guest 
          @params : 
            - uint256 tokenId_ : the token subscription 
        */
        function becomeGuest_fiatWay(address guest_, uint256 tokenId_) external isOwner() {
            /* Conditions */ 
            // 1. Host has authorized this user to be his guest 
            require(_tokenAuthorisations[guest_] == tokenId_, "No one authorizes you to be a guest");

            // 2. The token can have new guests
            uint256 currentNbGuests = _numberOfguests[tokenId_].current();
            require (currentNbGuests < _MaxGuests, "you can not add new guests to your susbscription !");
            
            // 3. Guest has never been subscribed or been a guest 
            require (get_tokenIdHost(guest_) == 0, "This guest has already been associated to a token");
      
            /* Task */
            // Step 0 : add a guest 
            _tokenIdHost[guest_] = tokenId_;

            // Step 1 : emit event 
            emit guestSet_fiatWay(guest_, tokenId_, currentNbGuests) ;
            
        } 

        /*
        * @dev Payment in crypto : an user become a guest of subscription | Called by a guest 
          @params : 
            - uint256 tokenId_ : the token subscription 
        */
        function becomeGuest_cryptoWay(uint256 tokenId_) external payable {
            /* Conditions */ 
            // 1. Host has authorized this user to be his guest 
            require(_tokenAuthorisations[msg.sender] == tokenId_, "No one authorizes you to be a guest");

            // 2. The token can have new guests
            uint256 currentNbGuests = _numberOfguests[tokenId_].current();
            require (currentNbGuests < _MaxGuests, "you can not add new guests to your susbscription !");
            
            // 3. Guest has never been subscribed or been a guest 
            require (get_tokenIdHost(msg.sender) == uint256(0), "This guest has already been associated to a token");
      
            /* Task */
            // Step 0 : add a guest 
            _tokenIdHost[msg.sender] = tokenId_;

            // Step 1 : Fees payment
            uint256 value = msg.value;

            // pay the contract owner 
            uint256 owner_fees = value.mul(20).div(100); 
            address payable owner_payable = payable(_owner);
            owner_payable.transfer(owner_fees);
            
            // pay the author 
            uint256 author_fees = value.mul(50).div(100); 
            address payable author_payable = payable(_author);
            author_payable .transfer(author_fees);

            // pay the subscriber
            
            uint256 subscriber_fees = value.mul(30).div(100);

            address subscriber = ownerOf(tokenId_);
            address payable subscriber_payable = payable(subscriber);
            subscriber_payable.transfer(subscriber_fees);
            

            // Step 3 : emit event 
            emit guestSet_cryptoWay(msg.sender, tokenId_, currentNbGuests) ;
            
        }

        /*
            @dev a user subscribe to our service | Payment in Crypto
            @params :
                - address subscriber_ : the address of the subscriber 
                - uint256 tokenId_ : the Id of the subscription 
        */
        function subscribe_cryptoWay(uint256 tokenId_) external payable {
            address subscriber_ = msg.sender;
            /* Conditions */
            // 1. User has never subscribed 
            require(balanceOf(subscriber_) <= 0, "This user can not have 2 active subscriotions simultaneously");

            /* Task */

            // Step 0 : Let's subscribe 
            _safeMint(subscriber_, tokenId_);

            // Step 1 : Initialize the number of guest assoicates to his subsciption 
            _numberOfguests[tokenId_].reset();

            // Step 2 : subscriber become an host of its subscription | If the user subscribed, he could not any more become a guest 
            _tokenIdHost[subscriber_] = tokenId_;

            // Step 3 : pay author and owner

            // pay the contract owner 
            uint256 value = msg.value;
            uint256 owner_fees = value.mul(20).div(100); 
            address payable owner_payable = payable(_owner);
            owner_payable.transfer(owner_fees);
            
            // pay the author 
            uint256 author_fees = value.mul(80).div(100); 
            address payable author_payable = payable(_author);
            author_payable.transfer(author_fees);

            // Step 4 : emit an event 
            emit newSubscriber_cryptoWay(subscriber_, tokenId_);

        }

        /*
            @dev a user subscribe to our service | Payment in Fiat
            @params :
                - address subscriber_ : the address of the subscriber 
                - uint256 tokenId_ : the Id of the subscription 
        */
        function subscribe_fiatWay(address subscriber_, uint256 tokenId_) external payable isOwner() {
            /* Conditions */
            // 1. User has never subscribed 
            require(balanceOf(subscriber_) <= 0, "This user can not have 2 active subscriotions simultaneously");
            

            /* Task */

            // Step 0 : Let's subscribe 
            _safeMint(subscriber_, tokenId_);

            // Step 1 : Initialize the number of guest assoicates to his subsciption 
            _numberOfguests[tokenId_].reset();

            // Step 2 : subscriber become an host of its subscription | If the user subscribed, he could not any more become a guest 
            _tokenIdHost[subscriber_] = tokenId_;

            // Step 3 : emit an event 
            emit newSubscriber_fiatWay(subscriber_, tokenId_);

        }

        /* E.2 [Getter Function] */

        /**
        * @dev Return owner address 
        * @return address of owner
        */
        function getOwner() external view returns (address) {
            return _owner;
        }

        /**
        * @dev Return author address 
        * @return address of author
        */
        function getAuthor() external view returns (address) {
            return _author;
        }

        /**
        * @dev Return MaxGuests
        * @return address of MaxGuests
        */
        function getMaxGuests() external view returns (uint256) {
            return _MaxGuests;
        }

        /*
            @dev Get the token associates to a guest 
            @Params : 
                - address user_ : the guest
            @return : uint256 : a tokenId 
        */
        function get_tokenIdHost(address guest_) public view returns(uint256){
            return _tokenIdHost[guest_];
        }

        /*
            @dev Get the number of guests of a token 
            @Params : 
                - uint256 tokenId_ : the token 
            @return : Counters.Counter : the numbe rof guest of a tokenId
        */
        function get_numberOfguests(uint256 tokenId_) public view returns(uint256){
            uint256 out = _numberOfguests[tokenId_].current();
            return out;
        }

        /*
            @dev Get  _tokenAuthorisations[guest_]
            @Params : 
                - guest_ : the guest to assess 
            @return : Counters.Counter : the numbe rof guest of a tokenId
        */
        function get_tokenAuthorisations(address guest_) public view returns(uint256){
            uint256 out =  _tokenAuthorisations[guest_];
            return out;
        }

        /* E.3 [ERC 721 Functionnalities] */

    /**
     * @dev See {IERC721-transferFrom}. | Transfer is not possible 
     */
    function transferFrom(address from,address to,uint256 tokenId) public virtual override(ERC721) {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");

        //_transfer(from, to, tokenId);
    }
}

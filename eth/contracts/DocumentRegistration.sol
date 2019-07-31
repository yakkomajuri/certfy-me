pragma solidity ^ 0.5.0;

/** 
 * @title Document Registration 
 * @author Yakko Majuri
 * @notice Contract DocumentRegistration handles registrations of users and documents
 * as well as authentication
 * @dev Storage and Logic separated for the purpose of the upgradability pattern
*/

contract FeePool {

    function incrementPool() public {}

}

contract Owners {

    function getOwners(address _ad) public view returns(bool) { }

}


contract CertfyToken {

    function distributeTokens(address account) external returns(bool) { }

}


contract Storage {

    /// Declares the other contracts that interoperate with DocumentRegistration
    CertfyToken public tokenContract;
    Owners public ownerContract;
    FeePool public feePoolContract;

    // Address 'current' receives fees from the platform directly    
    address payable public current;

    // Establishes the prices for different actions on the platform
    uint[] public prices;

    // Declares arrays of the existing structs to allow for iterability
    Document[] public temporaryDocs;
    Document[] public documents;
    Registrant[] public registrants;

    // Maps an identifying 'bytes32' value to Documents and Temporary Documents
    mapping(bytes32 => Document) public temporaryRegistry;
    mapping(bytes32 => Document) public registry;

    // Verified Addresses have submitted an attestation to their real-world identity
    mapping(address => Registrant) public verifiedAddress;

    // Keeps track of the documents registered by each address
    mapping(address => mapping(uint32 => Document)) public userDocs;
    mapping(address => uint32) public docsPerUser;

    // Number utilized to prevent clashes between documents of the same name
    mapping(string => uint32) temporaryIndex;
    mapping(string => uint32) nameIndex;

    // Used for initialization of the contract, since it should not have a constructor 
    // due to the proxy implementation
    bool ownersSet;

    // Each Document registered on the platform will feature this information
    struct Document {
        string name;
        string metadata;
        uint timestamp;
        address registrant;
        address signee;
        bytes32 hash;
        bool isEntity;
    }
    
    // Used to submit attestations to identity for each address
    struct Registrant {
        string name;
        string description;
        address user;
        bool isEntity;
    }

    // Allows the client to get the index of the document and display to the user 
    event LogDocumentIndex(uint index);
    event LogTemporaryIndex(uint index);

    // Calls the separate 'Owners' contract to verify if 'msg.sender' is an owner
    modifier onlyOwners() {
        require(ownerContract.getOwners(msg.sender));
        _;
    }

}

contract DocumentRegistration is Storage {

    // Do not accept ETH
    function() external payable { revert(); }

    /** 
     * @notice Part of initialization for the contract - sets address for 'Owners' contract
     * @param _ownerContract Address of 'Owners'
     * @dev Initialization must be done separately because contract cannot have a constructor
    */
    function setOwnersContract(address _ownerContract) external {
        require(ownersSet == false);
        ownerContract = Owners(_ownerContract);
        ownersSet = true;
    }

    /** 
     * @notice Part of initialization for the contract - sets address for 'CertfyToken' contract
     * @param _tokenContract Address of 'CertfyToken'
     * @dev Initialization must be done separately because contract cannot have a constructor
    */
    function setTokenContract(address _tokenContract) external onlyOwners {
        tokenContract = CertfyToken(_tokenContract);
    }

    /** 
     * @notice Part of initialization for the contract - sets prices for actions on the platform
     * @param _prices Array with the respective prices in order
     * @dev Prices are in wei - Should be taken into account on the client
    */
    function setPrices(uint[] calldata _prices) external onlyOwners {
        prices = _prices;
    }

    /** 
     * @notice Change one specific price
     * @param _index Index of price to change in array
     * @param _price New price
    */
    /*
    function setPrice(uint8 _index, uint128 _price) external onlyOwners {
        prices[_index] = _price;
    }
*/
    
    /** 
     * @notice Sets the 'current' address which receives fees
     * @param _current Address to receive payments
    */
    function setCurrent(address payable _current) external onlyOwners {
        current = _current;
    }

    /** 
     * @notice Sets the 'FeePool' contract address which receives ETH from fees
     * @param _contractAddress FeePool address
    */
    function setPoolContract(address payable _contractAddress) external onlyOwners {
        feePoolContract = FeePool(_contractAddress);
    }


    /** 
     * @notice Creates a new simple document registration
     * @param _name User-assigned name for document
     * @param _metadata A description or any other form of public metadata about the document
     * @param _fileHash Fed by the client - hash of the file uploaded by the user (could also be IPFS hash)
     * @dev The hash of user-determined "name" and contract-determined "index" are mapped to each document
     * such that finding registrations can make use of human-readable names
    */
    function registerDocument(
        string calldata _name,
        string calldata _metadata,
        bytes32 _fileHash
    )
    external
    payable {
        require(msg.value == prices[1],
            "wrong value");
        current.transfer(msg.value/2);
        address fp = address(feePoolContract);
        address payable feePool = address(uint160(fp));
        feePool.transfer(msg.value/2);
        bytes32 hash = keccak256(abi.encodePacked(_name, nameIndex[_name]));
        userDocs[msg.sender][docsPerUser[msg.sender]] = registry[hash] = Document(
            _name,
            _metadata,
            block.timestamp,
            msg.sender,
            address(0),
            _fileHash,
            true
        );
        documents.push(Document(
            _name,
            _metadata,
            block.timestamp,
            msg.sender,
            address(0),
            _fileHash,
            true
        ));
        nameIndex[_name]++;
        docsPerUser[msg.sender]++;
        emit LogDocumentIndex(nameIndex[_name] - 1);
        tokenContract.distributeTokens(msg.sender);
        feePoolContract.incrementPool();
    }

    /** 
     * @notice Initiates a multi-sig registration, currently only available for two parties
     * @param _name User-assigned name for document
     * @param _metadata A description or any other form of public metadata about the document
     * @param _fileHash Fed by the client - hash of the file uploaded by the user (could also be IPFS hash)
     * @param _signee Second address which must sign the registration
     * @dev Document is added to a "temporary registry" and awaits the second signature before being 
     * added to the final document registry
    */
    function registerMultiSig(
        string calldata _name,
        string calldata _metadata,
        bytes32 _fileHash,
        address _signee
    )
    external
    payable
    {
        require(msg.value == prices[2] / 2);
        current.transfer(msg.value/2);
        address fp = address(feePoolContract);
        address payable feePool = address(uint160(fp));
        feePool.transfer(msg.value/2);
        bytes32 hash = keccak256(abi.encodePacked(_name, temporaryIndex[_name])); // temporaryIndex is separate from nameIndex
        temporaryRegistry[hash] = Document(
            _name,
            _metadata,
            block.timestamp,
            msg.sender,
            _signee,
            _fileHash,
            true
        );
        temporaryDocs.push(Document(
            _name,
            _metadata,
            block.timestamp,
            msg.sender,
            _signee,
            _fileHash,
            true
        ));
        temporaryIndex[_name]++; // Allow temporary registrations under the same name
        emit LogTemporaryIndex(temporaryIndex[_name] - 1);
        tokenContract.distributeTokens(msg.sender);
        feePoolContract.incrementPool();
    }

    /** 
     * @notice Signs an existing temporary registration
     * @param _name Name of the document to be signed
     * @param _temporaryIndex Index of the document to be signed
     * @dev If msg.sender is the desginated signee the registration is added to the true document registry
    */
    function signDocument(
        string calldata _name,
        uint32 _temporaryIndex
    )
    external
    payable
    {
        require(msg.value == prices[2] / 2, 
        "the price aint right");
        bytes32 temporaryHash = keccak256(abi.encodePacked(_name, _temporaryIndex));
        bytes32 permanentHash = keccak256(abi.encodePacked(_name, nameIndex[_name]));
        require(registry[permanentHash].isEntity == false,
        "document already exists");
        require(temporaryRegistry[temporaryHash].isEntity,
        "temporary document was not registered");
        address signee = temporaryRegistry[temporaryHash].signee;
        address registrant = temporaryRegistry[temporaryHash].registrant;
        require(signee == msg.sender,
        "msg.sender is not signee");
        current.transfer(msg.value/2);
        address fp = address(feePoolContract);
        address payable feePool = address(uint160(fp));
        feePool.transfer(msg.value/2);
        userDocs[registrant][docsPerUser[registrant]] = userDocs[msg.sender][docsPerUser[msg.sender]] = registry[permanentHash] = Document(
            temporaryRegistry[temporaryHash].name,
            temporaryRegistry[temporaryHash].metadata,
            block.timestamp,
            temporaryRegistry[temporaryHash].registrant,
            signee,
            temporaryRegistry[temporaryHash].hash,
            true
        );
        documents.push(Document(
            temporaryRegistry[temporaryHash].name,
            temporaryRegistry[temporaryHash].metadata,
            block.timestamp,
            temporaryRegistry[temporaryHash].registrant,
            signee,
            temporaryRegistry[temporaryHash].hash,
            true
        ));
        nameIndex[_name]++;
        docsPerUser[signee]++;
        docsPerUser[msg.sender]++;
        emit LogDocumentIndex(nameIndex[_name] - 1);
        tokenContract.distributeTokens(msg.sender);
        feePoolContract.incrementPool();
    }


    /** 
     * @notice Allows users to link their address to a real-world identity
     * @param _name Name of the person/entity behind the address
     * @param _description A field for providing evidence of the identity
     * Evidence could take multiple forms, such as: 
     * - URL of the company website where it states the address is owned by the company
     * - IPFS hash of a picture holding a paper with the address written on it
    */
    function registerAddress(
        string calldata _name,
        string calldata _description
    )
    external
    payable {
        require(msg.value == prices[1]);
        current.transfer(msg.value/2);
        address fp = address(feePoolContract);
        address payable feePool = address(uint160(fp));
        feePool.transfer(msg.value/2);
        verifiedAddress[msg.sender] = Registrant(
            _name,
            _description,
            msg.sender,
            true);
        registrants.push(Registrant(_name, _description, msg.sender, true));
        tokenContract.distributeTokens(msg.sender);
        feePoolContract.incrementPool();
    }

    /** 
     * @notice Allows users to update information about their identity
     * @param _name Name of the person/entity behind the address
     * @param _description A field for providing evidence of the identity
     * @dev Previous identity specified can still be found
     * @dev Costs a fee to prevent constant identity updates
    */
    function updateInfo(
        string memory _name,
        string memory _description
    )
    public
    payable {
        require(msg.value == prices[3]);
        require(verifiedAddress[msg.sender].isEntity);
        current.transfer(msg.value/2);
        address fp = address(feePoolContract);
        address payable feePool = address(uint160(fp));
        feePool.transfer(msg.value/2);
        verifiedAddress[msg.sender].name = _name;
        verifiedAddress[msg.sender].description = _description;
        registrants.push(Registrant(_name, _description, msg.sender, true));
        feePoolContract.incrementPool();
    }


    /** 
     * @notice Checks if two documents (hashes) are the same
     * @param _name Name of the document
     * @param _nameIndex Index of the document
     * @param _fileHash Hash of the file being tested, fed by the client
     * @dev File hash of the specified document is pulled and compared to the supplied hash
     * @return Returns a boolean specifying if the hashes match or not
    */
    function verifyDocument(
        string calldata _name,
        uint32 _nameIndex,
        bytes32 _fileHash
    )
    external
    view
    returns(bool) {
        bytes32 hash = keccak256(abi.encodePacked(_name, _nameIndex));
        if (registry[hash].hash == _fileHash) {
            return true;
        } else {
            return false;
        }
    }

    /** 
     * @notice Pulls the data for a temporary registration
     * @notice Useful for verifying data before signing it 
     * @param _name Name of the document
     * @param _index Index of the document
     * @return Returns all information about a temporary registration
    */
    function checkTemporary(string calldata _name, uint32 _index)
    external
    view
    returns(
        string memory,
        uint,
        address,
        address,
        bytes32
    ) {
        bytes32 hash = keccak256(abi.encodePacked(_name, _index));
        return (
            temporaryRegistry[hash].metadata,
            temporaryRegistry[hash].timestamp,
            temporaryRegistry[hash].registrant,
            temporaryRegistry[hash].signee,
            temporaryRegistry[hash].hash
        );
    }

    /** 
     * @notice Pulls the data for a document registration
     * @param _name Name of the document
     * @param _nameIndex Index of the document
     * @return Returns all information about a document registration
    */
    function documentQuery(string calldata _name, uint32 _nameIndex)
    external
    view
    returns(string memory, uint, address, address) {
        bytes32 hash = keccak256(abi.encodePacked(_name, _nameIndex));
        return (
            registry[hash].metadata,
            registry[hash].timestamp,
            registry[hash].registrant,
            registry[hash].signee
        );
    }

}
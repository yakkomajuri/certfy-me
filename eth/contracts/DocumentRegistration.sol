pragma solidity ^ 0.5 .0;


contract Owners {

    function getOwners(address _ad) public view returns(bool) {}

}

contract CertfyToken {
    
    function distributeTokens(address account) external returns (bool) {}

}

contract Storage {

        modifier onlyOwners() {
            // Commented out for tests only - remove comment in production
            // require(ownerContract.getOwners(msg.sender));
                _;
        }



        struct Document {
                string name;
                string metadata;
                uint timestamp;
                address registrant;
                address signee;
                bytes32 hash;
                bool isEntity;
        }

        struct Registrant {
                string name;
                string description;
                address user;
                bool isEntity;
        }


        address payable public current;

        uint[] public prices;

        Document[] public temporaryDocs;
        Document[] public documents;
        Registrant[] public registrants;

        mapping(bytes32 => Document) public temporaryRegistry;
        mapping(bytes32 => Document) public registry;

        mapping(address => Registrant) public verifiedAddress;

        mapping(address => mapping(uint32 => Document)) public userDocs;
        mapping(address => uint32) public docsPerUser;

        mapping(string => uint32) temporaryIndex;
        mapping(string => uint32) nameIndex;

        bool ownersSet;

        event DocumentIndex(uint index);

        CertfyToken public tokenContract;
        Owners public ownerContract;

        address payable feePoolContract;
}


contract DocumentRegistration is Storage {


        function setTokenContract(address _contract) external onlyOwners {
                tokenContract = CertfyToken(_contract);
        }

        function setOwnersContract(address _ownerContract) external {
                require(ownersSet == false);
                ownerContract = Owners(_ownerContract);
                ownersSet = true;
        }


        function setPrices(uint[] calldata _prices) external onlyOwners {
                prices = _prices;
        }

        function setPrice(uint8 _index, uint128 _price) external onlyOwners {
                prices[_index] = _price;
        }

        function setCurrent(address payable _current) external onlyOwners {
                current = _current;
        }

        function registerDocument(
                string calldata _name,
                string calldata _metadata,
                bytes32 _fileHash
        )
        external
        payable {
                require(msg.value == prices[1],
                "wrong value");
                //current.transfer(msg.value);
                //feePoolContract.transfer(msg.value/2);
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
                // Commented out for tests only - remove comment for production
                // tokenContract.distributeTokens(msg.sender);
                emit DocumentIndex(nameIndex[_name] - 1);
        }

        function registerMultiSig(
                string calldata _name,
                string calldata _metadata,
                bytes32 _fileHash,
                address _signee
        )
        external
        payable {
                require(msg.value == prices[2] / 2);
                current.transfer(msg.value);
                feePoolContract.transfer(msg.value/2);
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
                tokenContract.distributeTokens(msg.sender);
                emit DocumentIndex(temporaryIndex[_name] - 1);
        }

        function signDocument(string calldata _name, uint32 _temporaryIndex) external payable returns(uint) {
                require(msg.value == prices[2] / 2);
                current.transfer(msg.value);
                feePoolContract.transfer(msg.value/2);
                bytes32 temporaryHash = keccak256(abi.encodePacked(_name, _temporaryIndex));
                bytes32 permanentHash = keccak256(abi.encodePacked(_name, nameIndex[_name]));
                require(registry[permanentHash].isEntity == false);
                require(temporaryRegistry[temporaryHash].isEntity);
                address signee = temporaryRegistry[temporaryHash].signee;
                address registrant = temporaryRegistry[temporaryHash].registrant;
                require(signee == msg.sender);
                // Next line could be flawed - not registering for one
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
                tokenContract.distributeTokens(msg.sender);
                emit DocumentIndex(nameIndex[_name] - 1);
        }

        function registerAddress(
                string calldata _name,
                string calldata _description
        )
        external
        payable {
                require(msg.value == prices[1]);
                current.transfer(msg.value);
                feePoolContract.transfer(msg.value/2);
                verifiedAddress[msg.sender] = Registrant(
                        _name,
                        _description,
                        msg.sender,
                        true);
                registrants.push(Registrant(_name, _description, msg.sender, true));
        }

        function updateInfo(
                string memory _name,
                string memory _description
        )
        public
        payable {
                require(msg.value == prices[3]);
                require(verifiedAddress[msg.sender].isEntity);
                current.transfer(msg.value/2);
                feePoolContract.transfer(msg.value/2);
                verifiedAddress[msg.sender].name = _name;
                verifiedAddress[msg.sender].description = _description;
                registrants.push(Registrant(_name, _description, msg.sender, true));
        }

        function verifyDocument(string calldata _name, uint32 _nameIndex, bytes32 _fileHash) external view returns(bool) {
                bytes32 hash = keccak256(abi.encodePacked(_name, _nameIndex));
                if (registry[hash].hash == _fileHash) {
                        return true;
                } else {
                        return false;
                }
        }

    function checkTemporary(string calldata _name, uint32 _index)
    external
    view
    returns(string memory, uint, address, address, bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(_name, _index));
        return (
            temporaryRegistry[hash].metadata,
            temporaryRegistry[hash].timestamp,
            temporaryRegistry[hash].registrant,
            temporaryRegistry[hash].signee,
            temporaryRegistry[hash].hash
        );
    }

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

        function setPoolContract(address payable _contract) external onlyOwners {
                feePoolContract = _contract;
        }
}

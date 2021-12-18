// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//TODO ADD METADATA FREEZING AND SENDTO FUNCTION
contract Postcard is ERC721URIStorage, Ownable {
//    uint256 public tokenCounter;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    mapping(string => uint8) private _hashes;

    // Base URI
    string private _baseURIExtended = "https://ipfs.io/ipfs/";

    // constructor with name and symbol of nft
    constructor() ERC721("Postcard","PSC") {
    }
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
    // for opensea collection
    // this is currently being used to determine which metadata(json) it uses for the NFT. token URI doesnt do anything atm
    function contractURI() public pure returns (string memory) {
        return "https://ipfs.io/ipfs/QmcbqmQn3248WytoNPKbapP8rYXmr1efVnb8t7qEi8aLgY"; // collection json ipfs
    }

    function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIExtended = baseURI_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIExtended;
    }

    function mint(string memory tokenHash)
    public
    onlyOwner
    returns (uint256)
    {
        require(_hashes[tokenHash] != 1);
        _hashes[tokenHash] = 1;
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenHash);
        return newItemId;
    }

    function duplicateMint(string memory tokenHash, uint256 numberOfTokens)
    public
    onlyOwner
//    returns (uint256)
    {
        require(numberOfTokens<=10, "not more than 10 at once");
        require(_hashes[tokenHash]<=100);

        for(uint256 i=0; i < numberOfTokens; i++){
            _hashes[tokenHash] = _hashes[tokenHash] + 1;
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _safeMint(msg.sender, newItemId);
//            _mint(msg.sender, newItemId);
            _setTokenURI(newItemId, tokenHash);
        }
//        return newItemId;
//        return numberOfTokens+" tokens of "+tokenHash;
    }
    function oldDuplicateMint(string memory tokenHash)
    public
    onlyOwner
    returns (uint256)
    {
        _hashes[tokenHash] = 1;
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenHash);
        return newItemId;
    }


}
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//TODO ADD METADATA FREEZING

//https://github.com/neha01/nft-demo/blob/master/contracts/ArtCollectible.sol ref
//https://forum.openzeppelin.com/t/function-settokenuri-in-erc721-is-gone-with-pragma-0-8-0/5978/3 another ref
contract Postcard is ERC721, Ownable {
//    uint256 public tokenCounter;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    // Optional mapping for token URIs
    // copied from ERC721URIStorage.sol
    mapping(uint256 => string) private _tokenURIs;

    // mapping
    // not sure if i want it or not
    mapping(string => uint8) private _hashes;

    // Base URI
    string private _baseURIExtended = "ipfs.io/ipfs/";

    // constructor with name and symbol of nft
    constructor() ERC721("Postcard","PSC") {
    }
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    // for opensea collection
    // this is currently being used to determine which metadata(json) it uses for the NFT. token URI doesnt do anything atm
    function contractURI() public pure returns (string memory) {
        return "ipfs.io/ipfs/QmcbqmQn3248WytoNPKbapP8rYXmr1efVnb8t7qEi8aLgY"; // collection json ipfs
    }

    function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIExtended = baseURI_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIExtended;
    }

    // copied from ERC721URIStorage.sol
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;

        //_hashes[_tokenURI] = 1;
    }

    // copied from ERC721URIStorage.sol
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
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
        _safeMint(msg.sender, newItemId);
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
    // from https://docs.openzeppelin.com/contracts/4.x/erc721
    function oldDuplicateMint(string memory tokenHash)
    public
    onlyOwner
    returns (uint256)
    {
        _hashes[tokenHash] = 1;
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenHash);
        return newItemId;
    }


}
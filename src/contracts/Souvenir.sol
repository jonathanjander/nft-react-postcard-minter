// SPDX-License-Identifier: MIT
//pragma solidity >=0.4.22 <0.9.0;
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC2981Royalty.sol";
//TODO ADD METADATA FREEZING
//TODO SOMETHING DOESNT WORK PROPERLY
//TODO ADD PERCENT TO CREATOR OF CONTRACTS

//https://github.com/neha01/nft-demo/blob/master/contracts/ArtCollectible.sol ref
//https://forum.openzeppelin.com/t/function-settokenuri-in-erc721-is-gone-with-pragma-0-8-0/5978/3 another ref
contract Souvenir is ERC721, Ownable, ERC2981Royalty{
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    // Optional mapping for token URIs
    // copied from ERC721URIStorage.sol
    mapping(uint256 => string) private _tokenURIs;


    // mapping
    // not sure if i want it or not
    mapping(string => uint8) private _hashes;

    // Base URI
    string private _baseURIExtended = "https://ipfs.io/ipfs/";

//    address private _royaltyRecipient = owner();
    address private _royaltyRecipient;

    // constructor with name and symbol of nft
    constructor() ERC721("Souvenir","SVN"){
        _royaltyRecipient = owner();
    }



    // write tests for this method
    //what does this even do
    /// @inheritdoc	ERC165
    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721, ERC2981Base)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    // FIX
    // BROKEN CUZ OF BURN
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    // for opensea collection
    // this is currently being used to determine which metadata(json) it uses for the NFT
    function contractURI() public pure returns (string memory) {
        return "https://ipfs.io/ipfs/QmcbqmQn3248WytoNPKbapP8rYXmr1efVnb8t7qEi8aLgY"; // collection json ipfs
    }

    function setBaseURI(string memory baseURI_)
    external
    onlyOwner
    {
        _baseURIExtended = baseURI_;
    }

    function _baseURI()
    internal
    view
    virtual
    override
    returns (string memory)
    {
        return _baseURIExtended;
    }

    // memory didnt work
    function setRoyaltyRecipient(address royaltyRecipient_)
    external
    onlyOwner
    {
        _royaltyRecipient = royaltyRecipient_;
    }

    // copied from ERC721URIStorage.sol
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    // copied from ERC721URIStorage.sol
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
    function royaltyRecipient() public view virtual returns (address) {
        return _royaltyRecipient;
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
    // public or external?
    /// value percentage (using 2 decimals - 10000 = 100, 0 = 0)
    function mint(string memory tokenHash, uint256 royaltyAmount)
    public
    onlyOwner
    {
        _hashes[tokenHash] = _hashes[tokenHash] + 1;
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenHash);
        if (royaltyAmount > 0) {
            _setTokenRoyalty(newTokenId, _royaltyRecipient, royaltyAmount);
        }
    }

    function mintTo(string memory tokenHash, address receiver)
    public
    onlyOwner
    {
        _hashes[tokenHash] = _hashes[tokenHash] + 1;
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(receiver, newItemId);
        _setTokenURI(newItemId, tokenHash);
    }

    // questionable
    // mint multiple tokens
    function mintBatch(string memory tokenHash, uint256 numberOfTokens)
    public
    onlyOwner
    {
        require(numberOfTokens<=10, "not more than 10 at once");
        require(_hashes[tokenHash]<=100);

        for(uint256 i=0; i < numberOfTokens; i++){
            _hashes[tokenHash] = _hashes[tokenHash] + 1;
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _safeMint(msg.sender, newItemId);
            _setTokenURI(newItemId, tokenHash);
        }
    }

}
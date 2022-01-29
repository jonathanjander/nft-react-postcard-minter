// SPDX-License-Identifier: MIT
//pragma solidity >=0.4.22 <0.9.0;
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC2981Royalty.sol";

//TODO ADD METADATA FREEZING
//TODO ADD PERCENT TO CREATOR OF CONTRACTS

//https://github.com/neha01/nft-demo/blob/master/contracts/ArtCollectible.sol ref
//https://forum.openzeppelin.com/t/function-settokenuri-in-erc721-is-gone-with-pragma-0-8-0/5978/3 another ref
contract Souvenir is ERC721, Ownable, ERC2981Royalty{
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _numOfTokens;

    // Optional mapping for token URIs
    // copied from ERC721URIStorage.sol
    mapping(uint256 => string) private _tokenURIs;

    // mapping
    // not sure if i want it or not
    mapping(string => uint8) private _hashes;

    // Base URI
    // string private _baseURIExtended = "https://ipfs.io/ipfs/";
    string private _baseURIExtended = "ipfs://";

    // address private _royaltyRecipient = owner();
    address private _royaltyRecipient;

    // constructor with name and symbol of nft
    constructor() ERC721("Souvenir","SVN"){
        _royaltyRecipient = owner();
    }



    // function to validate interfaces
    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721, ERC2981Base)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    function totalSupply() public view returns (uint256) {
        return _numOfTokens.current();
    }

    // collection representation
    // marketplaces use this function in order to assign tokens to this collection
    // pure is a keyword, which ensures that the function doesnt view nor modify the state
    function contractURI() public pure returns (string memory) {
//        return "https://ipfs.io/ipfs/QmcbqmQn3248WytoNPKbapP8rYXmr1efVnb8t7qEi8aLgY"; // collection json ipfs
        return "ipfs://QmPesCd1cJxnbAikjaoLy4UHiLZqfwbsCaVVzbSm3ZVyAJ"; // collection json ipfs
    }

    function setBaseURI(string memory baseURI_)
    external
    onlyOwner
    {
        _baseURIExtended = baseURI_;
    }

    // view is a keyword, which ensures that the function can view but not modify the state
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
        _numOfTokens.decrement();
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }

    // burns (destroys) a token.
    function burn(uint256 tokenId) public onlyOwner{
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


    // mint multiple tokens
    // value percentage (using 2 decimals - 10000 = 100, 0 = 0)
    // @param numberOfTokens amount of tokens to be minted. not more that 100
    // max copies of one nft is 500
    function mint(string memory tokenHash, uint256 numberOfTokens, uint256 royaltyAmount)
    external
    onlyOwner
    {
        require(numberOfTokens<=100, "not more than 100 at once");
        require(_hashes[tokenHash]<=500);

        for(uint256 i=0; i < numberOfTokens; i++){
            _hashes[tokenHash] = _hashes[tokenHash] + 1;
            _tokenIds.increment();
            _numOfTokens.increment();
            uint256 newTokenId = _tokenIds.current();
            _safeMint(msg.sender, newTokenId);
            _setTokenURI(newTokenId, tokenHash);
            if (royaltyAmount > 0) {
                _setTokenRoyalty(newTokenId, _royaltyRecipient, royaltyAmount);
            }
        }

    }

    // mints nft to 'receiver'
    function mintTo(string memory tokenHash, address receiver, uint256 royaltyAmount)
    external
    onlyOwner
    {
        _hashes[tokenHash] = _hashes[tokenHash] + 1;
        _tokenIds.increment();
        _numOfTokens.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(receiver, newTokenId);
        _setTokenURI(newTokenId, tokenHash);
        if (royaltyAmount > 0) {
            _setTokenRoyalty(newTokenId, _royaltyRecipient, royaltyAmount);
        }
    }


}
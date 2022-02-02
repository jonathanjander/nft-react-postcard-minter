// SPDX-License-Identifier: MIT
//pragma solidity >=0.4.22 <0.9.0;
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC2981Royalty.sol";

//TODO ADD METADATA FREEZING

//https://github.com/neha01/nft-demo/blob/master/contracts/ArtCollectible.sol ref
//https://forum.openzeppelin.com/t/function-settokenuri-in-erc721-is-gone-with-pragma-0-8-0/5978/3 another ref
contract Souvenir is ERC721, Ownable, ERC2981Royalty{
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _tokenSupply;

    // copied from ERC721URIStorage.sol (OpenZeppelin)
    // mapping between tokenURIs and tokenIDs
    mapping(uint256 => string) private _tokenURIs;

    // used to regulate how many copies of one NFT should exist
    mapping(string => uint8) private _hashes;

    // amount of possible copies of one NFT
    uint8 private constant MAX_AMOUNT_OF_COPIES = 100;

    // Base URI
    string private _baseURIExtended = "ipfs://";

    // address that receives royalty fees
    address private _royaltyRecipient;

    // constructor with name and symbol of nft
    // setting the owner to receive royalties
    constructor() ERC721("Souvenir","SVN"){
        _royaltyRecipient = owner();
    }



    // function to validate interfaces
    // used by marketplaces and other smart contracts in order to figure out if the contract followed the standards
    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721, ERC2981Base)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // returns the amount of total NFTs minted (created)
    function totalSupply() public view returns (uint256) {
        return _tokenSupply.current();
    }

    // collection representation
    // marketplaces use this function in order to assign the NFT-tokens to this collection
    // pure is a keyword, which ensures that the function doesnt view nor modify the state
    function contractURI() public pure returns (string memory) {
        return "ipfs://QmPesCd1cJxnbAikjaoLy4UHiLZqfwbsCaVVzbSm3ZVyAJ"; // collection json ipfs
    }

    // setter for baseURI
    // default is "ipfs://"
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

    // setter for royalty recipient
    function setRoyaltyRecipient(address royaltyRecipient_)
    external
    onlyOwner
    {
        _royaltyRecipient = royaltyRecipient_;
    }

    // copied from ERC721URIStorage.sol (OpenZeppelin)
    // internal setter for TokenURI
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    // copied from ERC721URIStorage.sol (OpenZeppelin)
    // internal burn _function
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);
        _tokenSupply.decrement();
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }

    // burns (destroys) a token.
    function burn(uint256 tokenId) external onlyOwner{
        _burn(tokenId);
    }
    //royalty recipient getter
    function royaltyRecipient() public view virtual returns (address) {
        return _royaltyRecipient;
    }

    // copied from ERC721URIStorage.sol (OpenZeppelin)
    // tokenURI getter
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


    // mints "numberOfTokens" to account who called this function.
    // value percentage (using 2 decimals - 10000 = 100, 0 = 0)
    // numberOfTokens limited to 20 at once
    // max copies of one nft is 100
    function mint(string memory tokenHash, uint256 numberOfTokens, uint256 royaltyAmount)
    external
    onlyOwner
    {
        require(numberOfTokens<=20, "not more than 20 at once");
        require(_hashes[tokenHash]<= MAX_AMOUNT_OF_COPIES);

        for(uint256 i=0; i < numberOfTokens; i++){
            _hashes[tokenHash] = _hashes[tokenHash] + 1;
            _tokenIds.increment();
            _tokenSupply.increment();
            uint256 newTokenId = _tokenIds.current();
            _safeMint(msg.sender, newTokenId);
            _setTokenURI(newTokenId, tokenHash);
            if (royaltyAmount > 0) {
                _setTokenRoyalty(newTokenId, _royaltyRecipient, royaltyAmount);
            }
        }

    }

    // mints nft to 'receiver'
    function mint(string memory tokenHash, uint256 numberOfTokens, uint256 royaltyAmount, address receiver)
    external
    onlyOwner
    {
        require(numberOfTokens<=20, "not more than 20 at once");
        require(_hashes[tokenHash]<= MAX_AMOUNT_OF_COPIES);

        for(uint256 i=0; i < numberOfTokens; i++){
            _hashes[tokenHash] = _hashes[tokenHash] + 1;
            _tokenIds.increment();
            _tokenSupply.increment();
            uint256 newTokenId = _tokenIds.current();
            _safeMint(receiver, newTokenId);
            _setTokenURI(newTokenId, tokenHash);
            if (royaltyAmount > 0) {
                _setTokenRoyalty(newTokenId, _royaltyRecipient, royaltyAmount);
            }
        }

    }


}
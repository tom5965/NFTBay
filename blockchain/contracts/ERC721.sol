pragma solidity ^0.8.17;

interface IERC721 {
  event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
  event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

  function balanceOf(address _owner) external view returns (uint256);
  function ownerOf(uint256 _tokenId) external view returns (address);
  function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
  function approve(address _approved, uint256 _tokenId) external payable;
}

contract ERC721 {
    address contractAddress;

    constructor(address _contractAddress) {
        contractAddress = _contractAddress;
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return IERC721(contractAddress).ownerOf(_tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable {
        require(msg.sender == this.ownerOf(_tokenId));
        IERC721(contractAddress).approve(_approved, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
        IERC721(contractAddress).transferFrom(_from, _to, _tokenId);
    }
}
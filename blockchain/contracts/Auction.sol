pragma solidity ^0.8.17;

contract Auction {
    uint public auctionInstanceCount = 0;
    
    struct AuctionInstance {
        uint id;
        address cosigner;
        string content;
        uint startingPrice;
    }

    event AuctionInstanceCreated(
        uint id
    );

    mapping(uint => AuctionInstance) public auctionInstances;

    function createAuctionInstance(string memory _content, uint startingPrice) public {
        auctionInstanceCount++;
        auctionInstances[auctionInstanceCount] = AuctionInstance(auctionInstanceCount, msg.sender, _content, startingPrice);
        emit AuctionInstanceCreated(auctionInstanceCount);
    }
}
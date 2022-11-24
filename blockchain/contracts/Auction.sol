pragma solidity ^0.8.17;

contract Auction {
    uint public auctionInstanceCount = 0;

    struct AuctionInstance {
        uint id;
        address cosigner;
        address tokenAddress;
        uint tokenId;
        uint highestBid;
        address highestBidder;
        uint auctionEndTime;
    }

    struct AuctionLog {
        address bidder;
        uint bidPrice;
        uint bidTime;
    }

    event AuctionInstanceCreated(
        uint auctionInstanceId
    );

    event AuctionLogCreated(
        uint auctionInstanceId,
        uint logIndex
    );

    mapping(uint => AuctionInstance) public auctionInstances;
    mapping(uint => AuctionLog[]) public auctionLogs;

    function createAuctionInstance(address tokenAddress, uint tokenId, uint startingPrice, uint auctionEndTime) external {
        //Todo: Check if sender owns nft
        auctionInstances[auctionInstanceCount] = AuctionInstance(auctionInstanceCount, msg.sender, tokenAddress, tokenId, startingPrice, msg.sender, auctionEndTime);
        emit AuctionInstanceCreated(auctionInstanceCount);
        auctionInstanceCount++;
        bid(auctionInstanceCount - 1, startingPrice);
    }

    function bid(uint _auctionInstanceId, uint bidPrice) public {
        require(_auctionInstanceId < auctionInstanceCount);
        require(block.timestamp <= auctionInstances[_auctionInstanceId].auctionEndTime, "Auction Ends!");

        auctionLogs[_auctionInstanceId].push(AuctionLog(msg.sender, bidPrice, block.timestamp));
        AuctionInstance memory currentAuctionInstance = auctionInstances[_auctionInstanceId];
        if (bidPrice > currentAuctionInstance.highestBid)
        {
            AuctionInstance memory newAuctionInstance = AuctionInstance(currentAuctionInstance.id, currentAuctionInstance.cosigner, currentAuctionInstance.tokenAddress, currentAuctionInstance.tokenId, bidPrice, msg.sender, currentAuctionInstance.auctionEndTime);
            auctionInstances[_auctionInstanceId] = newAuctionInstance;
        }
        emit AuctionLogCreated(_auctionInstanceId, auctionLogs[_auctionInstanceId].length - 1);
    }

    function getAuctionInstance(uint _auctionInstanceId) external view returns (AuctionInstance memory) {
        require(_auctionInstanceId < auctionInstanceCount);
        return auctionInstances[_auctionInstanceId];
    }

    function getAuctionLogs(uint _auctionInstanceId) external view returns (AuctionLog[] memory) {
        require(_auctionInstanceId < auctionInstanceCount);
        return auctionLogs[_auctionInstanceId];
    }
}
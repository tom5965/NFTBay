import './App.css';
import { useEffect, useState } from 'react';
import Web3 from 'web3'
import { AUCTION_ABI, AUCTION_ADDRESS } from './config'

function App() {
  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [auctionInstances, setAuctionInstances] = useState([]);
  const [newAuctionName, setNewAuctionName] = useState('');
  const [startingPrice, setStartingPrice] = useState(0);

  useEffect(() => {
    async function loadAccount() {
      const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545')
      const accounts = await web3.eth.requestAccounts()
      setAccount(accounts[0])
    }

    async function loadContract() {
      const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545')
      const auctionContract = new web3.eth.Contract(AUCTION_ABI, AUCTION_ADDRESS)
      setContract(auctionContract);

      auctionContract.events.AuctionInstanceCreated({
        fromBlock: 'latest'
      }, (error, event) => loadAuctionInstances(auctionContract));

      loadAuctionInstances(auctionContract);
    }

    async function loadAuctionInstances(contract) {
      setAuctionInstances([])
      const auctionInstanceCount = await contract.methods.auctionInstanceCount().call()

      for (var i = 1; i <= auctionInstanceCount; i++) {
        const auctionInstance = await contract.methods.auctionInstances(i).call()
        setAuctionInstances((auctionInstances) => [...auctionInstances, auctionInstance])
      }
  }

    loadAccount()
    loadContract()
    window.ethereum.on('accountsChanged', function (accounts) {
      setAccount(accounts[0])
    })
  }, [])

  function createAuctionInstance(name, startingPrice) {
    contract.methods.createAuctionInstance(name, startingPrice)
    .send({ from: account })
  }

  return(
    <div>
      Your account is: {account}
    <form onSubmit={(event) => {
      event.preventDefault()
      createAuctionInstance(newAuctionName, startingPrice)
    }}>
      <input type="text" value={newAuctionName} onChange = {({target: { value }}) => setNewAuctionName(value)} name="auctionName" />
      <input type="number" value={startingPrice} onChange = {({target: { value }}) => setStartingPrice(value)} name="startingPrice"/>
      <input type="submit" value="Create Auction" />
    </form>
    <ul id="auctionInstanceList" className="list-unstyled">
      { auctionInstances.map((auctionInstance, key) => {
        return(
          <div id="auctionInstanceTemplate" key={key}>
            <span className="content">{auctionInstance.content}</span>
            <span className="startingPrice">{auctionInstance.startingPrice}</span>
          </div>
        )
      })}
    </ul>
    </div>
  )
}

export default App;

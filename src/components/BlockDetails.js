import React, { useEffect, useState } from "react";

const BlockDetails = ({ blockNumber, alchemy }) => {
  const [selectedTransactionHash, setSelectedTransactionHash] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [tokenId, setTokenId] = useState("");
  const [nftMetadata, setNftMetadata] = useState("");
  const [showTransactions, setShowTransactions] = useState(false);
  const [showNftData, setShowNftData] = useState(false);
  const [blockInfo, setBlockInfo] = useState({
    number: null,
    hash: null,
    miner: null,
    nonce: null,
    baseFeePerGas: null,
    parentHash: null,
    timestamp: null,
    transactions: null,
    gasLimit: null,
    gasUsed: null,
    difficulty: null,
  });
  async function getNftMetadata() {
    setNftMetadata(await alchemy.nft.getNftMetadata(contractAddress, tokenId));
    setShowNftData(true);
  }
  useEffect(() => {
    async function getBlockInfo() {
      const blockInfoObject = await alchemy.core.getBlockWithTransactions(
        blockNumber
      );
      setBlockInfo({
        number: blockInfoObject.number,
        hash: blockInfoObject.hash,
        miner: blockInfoObject.miner,
        nonce: blockInfoObject.nonce,
        baseFeePerGas: blockInfoObject.baseFeePerGas,
        parentHash: blockInfoObject.parentHash,
        timestamp: blockInfoObject.timestamp,
        transactions: blockInfoObject.transactions,
        gasLimit: blockInfoObject.gasLimit,
        gasUsed: blockInfoObject.gasUsed,
        difficulty: blockInfoObject.difficulty,
      });
      console.log(blockInfoObject);
    }
    getBlockInfo();
    for (let i in blockInfo) {
      <h3>{i}</h3>;
    }
  }, [blockNumber]);

  // const blockTransactions = alchemy.core.getBlockWithTransactions(txHash);
  return (
    <div>
      {blockInfo && (
        <>
          <h1>BlockDetails</h1>
          <h3>Block Number : {blockInfo.number}</h3>
          <button
            onClick={() => {
              setShowTransactions(!showTransactions);
            }}
          >
            Show Transactions
          </button>
          {showTransactions && (
            <>
              <h3>Here is the List of Transactions: </h3>
              {blockInfo.transactions && blockInfo.transactions.length > 0 ? (
                blockInfo.transactions.map((transaction, index) => (
                  <div key={index}>
                    <h4
                      onClick={() => {
                        setSelectedTransactionHash(transaction.hash);
                      }}
                    >
                      {transaction.hash}
                    </h4>
                    {selectedTransactionHash === transaction.hash && (
                      <div>
                        <h4>Transaction Details :</h4>
                        <h5>{JSON.stringify(transaction)}</h5>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <h4>Error Fetching Transactions</h4>
              )}
            </>
          )}
        </>
      )}
      <div>
        {!showNftData ? (
          <>
            <h2>Get NFT metadata</h2>
            <input
              placeholder="Enter Contract Address"
              onChange={(e) => {
                setContractAddress(e.target.value);
              }}
              value={contractAddress}
            ></input>
            <input
              placeholder="Enter Token Id"
              onChange={(e) => {
                setTokenId(e.target.value);
              }}
              value={tokenId}
            ></input>
            <button onClick={() => getNftMetadata()}>Get NFT metadata</button>
          </>
        ) : (
          <>
            <button onClick={() => setShowNftData(false)}>
              Hide NFT metadata
            </button>
            <h5>{showNftData && JSON.stringify(nftMetadata)}</h5>
          </>
        )}
      </div>
    </div>
  );
};

export default BlockDetails;

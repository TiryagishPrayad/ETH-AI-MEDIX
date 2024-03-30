import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import Header from "./components/Header";
import Feedback from "./components/Feedback";
import Disease from "./components/Disease";

const accountNumbers = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  // ... (other addresses)
];

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedRecords, setUploadedRecords] = useState([]);
  const [userName, setUserName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState("");

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        if (provider) {
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          const contractAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
          const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
          setContract(contract);
          setProvider(provider);
          fetchUploadedRecords(contract, address);
          const name = await contract.getName(address);
          if (name) {
            setUserName(name);
            setIsNameSet(true);
          }
        } else {
          console.error("Metamask is not installed");
        }
      } catch (error) {
        console.error("Error loading provider:", error);
      }
    };

    loadProvider();
  }, []);

  const fetchUploadedRecords = async (contract, address) => {
    try {
      const records = await contract.display(address);
      setUploadedRecords(records);
    } catch (error) {
      console.error("Error fetching uploaded records:", error);
    }
  };
          
  const sendEther = async () => {
    try {
      if (!ethers.utils.isAddress(selectedRecipient)) {
        console.error("Invalid recipient address");
        return;
      }

      const amountToSend = parseFloat(prompt("Enter the amount of Ether to send:"));
      if (isNaN(amountToSend) || amountToSend <= 0) {
        console.error("Invalid amount");
        return;
      }

      const valueToSend = ethers.utils.parseEther(amountToSend.toString());

      const tx = await contract.sendTransaction({
        to: selectedRecipient,
        value: valueToSend,
      });

      await tx.wait();
      console.log("Transaction sent: ", tx.hash);

      fetchUploadedRecords(contract, account);
    } catch (error) {
      console.error("Error sending Ether:", error);
    }
  };

  return (
    <Router>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract} />}

      <div className="App">
        <Header />
        <div>
          <div>
            <p>Username: {userName}</p>
            <p>Account Address: {account}</p>
          </div>

          {!isNameSet ? (
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <button
                onClick={() => {
                  contract.setName(userName);
                  setIsNameSet(true);
                }}
              >
                Set Name
              </button>
            </div>
          ) : null}
        </div>

      

        <Routes>
          <Route
            path="/"
            element={
              <FileUpload account={account} provider={provider} contract={contract} />
            }
          />
          <Route
            path="/display"
            element={<Display contract={contract} account={account} />}
          />
          <Route
            path="/feedback"
            element={
              <Feedback
                contract={contract}
                account={account}
                uploadedRecords={uploadedRecords}
                userName={userName}
              />
            }
          />
          <Route path="/disease" element={<Disease contract={contract} account={account} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import Header from "./components/header";
import Feedback from "./components/Feedback";
import axios from "axios"; 
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedRecords, setUploadedRecords] = useState([]);
  const [userName, setUserName] = useState("");
  const [inputA, setInputA] = useState(""); // State to store input 'a'
  const [inputB, setInputB] = useState(""); // State to store input 'b'
  const [resultFromPython, setResultFromPython] = useState(""); // State to store result from Python

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
          const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
          const contract = new ethers.Contract(
            contractAddress,
            Upload.abi,
            signer
          );
          setContract(contract);
          setProvider(provider);
          fetchUploadedRecords(contract, address);
          // Load user's name if available
          const name = await contract.getName(address);
          if (name) {
            setUserName(name);
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

  const sendParametersToPython = async (a, b) => {
    try {
      const response = await axios.post('http://localhost:5000/', {
        a: a,
        b: b,
      });

      if (response.status === 200) {
        const data = response.data;
        // Now 'data' contains the result from the Python script
        setResultFromPython(data.result);
      } else {
        console.error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = () => {
   
    const a = parseFloat(inputA);
    const b = parseFloat(inputB);

    if (!isNaN(a) && !isNaN(b)) {
     
      sendParametersToPython(a, b);
    } else {
      // Handle invalid input
      console.error("Invalid input for 'a' and/or 'b'");
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

        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button onClick={() => contract.setName(userName)}>Set Name</button>
        <div className="resultFromPython">
          Result from Python: {resultFromPython}
        </div>
        <div className="inputFields">
          <input
            type="text"
            placeholder="Enter 'a'"
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter 'b'"
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit</button>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;

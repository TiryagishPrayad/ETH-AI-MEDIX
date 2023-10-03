import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import Header from "./components/header";
import Feedback from "./components/Feedback";
import "./App.css";
import Disease from "./components/dise";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedRecords, setUploadedRecords] = useState([]);
  const [userName, setUserName] = useState("");           
  const [isNameSet, setIsNameSet] = useState(false); 

 

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

  // const sendParametersToPython = async (a, b) => {
  //   try {
  //     const response = await axios.post('http://localhost:5001/', {
  //       a: a,
  //       b: b,
  //     });

  //     if (response.status === 200) {
  //       const data = response.data;
  //       setResultFromPython(data.result);
  //       return data.result;
  //     } else {
  //       console.error('Network response was not ok');
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     return null;
  //   }
  // };

  // const setPythonResultOnContract = async (result) => {
  //   try {
  //     const signer = provider.getSigner();
  //     const contractWithSigner = contract.connect(signer);
  //     const tx = await contractWithSigner.setPythonResult(result);
  //     await tx.wait();
  //     console.log("Python result stored on the smart contract");
  //   } catch (error) {
  //     console.error("Error setting Python result:", error);
  //   }
  // };

  // const handleSubmit = async () => {
  //   const a = parseFloat(inputA);
  //   const b = parseFloat(inputB);

  //   if (!isNaN(a) && !isNaN(b)) {
  //     try {
        
  //       const pythonResult = await sendParametersToPython(a, b);

  //       if (pythonResult !== null) {
          
  //         setResultFromPython(pythonResult);

         
  //         await setPythonResultOnContract(pythonResult);
  //       }
  //     } catch (error) {
  //       console.error("Error sending parameters to Python:", error);
  //     }
  //   } else {
  //     console.error("Invalid input for 'a' and/or 'b'");
  //   }
  // };

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
        {/* Display the username and account address */}
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
              <button onClick={() => {
                contract.setName(userName);
                setIsNameSet(true); // Set isNameSet to true after setting the name
              }}>
                Set Name
              </button>
            </div>
          ) : null}
        </div>
        {/* Routes */}
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
          <Route
            path="/disease"
            element={<Disease contract={contract} account={account} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



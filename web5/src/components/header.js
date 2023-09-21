import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import "./header.css";

const Header = () => {
  const [account, setAccount] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resultFromPython, setResultFromPython] = useState(""); // State to store the result
  const [inputA, setInputA] = useState(""); // State to store input 'a'
  const [inputB, setInputB] = useState(""); // State to store input 'b'
  const dropdownRef = useRef(null);

  useEffect(() => {
    const getAccount = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    };

    getAccount();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAccountClick = () => {
    copyToClipboard();
  };

  // Function to send parameters to Python and receive the result
  const sendParametersToPython = async (a, b) => {
    try {
      const response = await fetch('/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ a, b }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // Now 'data' contains the result from the Python script
      setResultFromPython(data.result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = () => {
    // Convert inputA and inputB to numbers (assuming they should be numbers)
    const a = parseFloat(inputA);
    const b = parseFloat(inputB);

    if (!isNaN(a) && !isNaN(b)) {
      // Call the 'sendParametersToPython' function with 'a' and 'b'
      sendParametersToPython(a, b);
    } else {
      // Handle invalid input
      console.error("Invalid input for 'a' and/or 'b'");
    }
  };

  return (
    <div className="wrapper">
      <Link to="http://localhost:3000">
        <div className="logoContainer">
          <img src={logo} alt="Ethmedix" height={80} width={80} />
          <div className="logoText">Ethmedix</div>
        </div>
      </Link>

      <div className="dropdownContainer">
        <div className="dropdownToggle" onClick={toggleDropdown}>
          Account
        </div>
        {dropdownOpen && (
          <div className="dropdownContent" ref={dropdownRef}>
            <div className="accountText" onClick={handleAccountClick}>
              {account ? account : "Not connected"}
            </div>
            {copySuccess && <div className="copySuccessMessage">Copied!</div>}
            {/* <div className="resultFromPython">
              {/* Result from Python: {resultFromPython}
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
            </div> */} 
            <Link to="/display" className="dropdownLink">
              Display
            </Link>
            <Link to="/feedback" className="dropdownLink">
              Feedback
            </Link>
            <Link to="/disease" className="dropdownLink">
              Disease
            </Link>
         
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

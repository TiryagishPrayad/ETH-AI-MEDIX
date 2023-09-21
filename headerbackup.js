import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import "./header.css";

const Header = () => {
  const [account, setAccount] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
            <Link to="/display" className="dropdownLink">
              Display
            </Link>
            <Link to="/feedback" className="dropdownLink">
              Feedback
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;



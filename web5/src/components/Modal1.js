
  import React, { useEffect, useState } from 'react';
  import './Modal.css';
  
  const Modal = ({ setModalOpen, contract }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [nameAddressMap, setNameAddressMap] = useState({});
  
    const handleInputChange = (event) => {
      const userInput = event.target.value;
      setQuery(userInput);
  
      const filteredOptions = Object.keys(nameAddressMap).filter(
        (address) =>
          nameAddressMap[address].toLowerCase().includes(userInput.toLowerCase())
      );
  
      setSuggestions(filteredOptions);
      setSelectedOption(null);
    };
  
    const handleOptionClick = (option) => {
      setQuery(option);
      setSuggestions([]);
      setSelectedOption(option);
    };
  
    const sharing = async () => {
      const address = document.querySelector('.account-number-input').value;
      await contract.allow(address);
      setModalOpen(false);
    };
  
    useEffect(() => {
      const fetchNames = async () => {
        const addressList = [
          "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
          "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
          "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
          "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
          "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
          "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
          "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
          "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
          "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
          "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
          "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
          "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
          "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
          "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
          "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
          "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
          "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
          "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        ];
        const map = {};
        for (const address of addressList) {
          console.log("Fetching name for address:", address);
          const name = await contract.getName(address);
          if (name) {
            map[address] = name;
            console.log("Name found for address:", address, "Name:", name);
          }
        }
        setNameAddressMap(map);
        console.log("Name-Address Map:", map);
      };
      contract && fetchNames();
    }, [contract]);
    
  
    return (
      <>
        <div className="modalBackground">
          <div className="modalContainer">
            <div className="title titleCloseBtn">
              <span>Paste The Address</span>
              <button onClick={() => setModalOpen(false)}>X</button>
            </div>
            <div className="body">
              {/* Input for account numbers */}
              <input
                type="text"
                className="account-number-input"
                value={query}
                onChange={handleInputChange}
                placeholder="Enter Account Name"
              />
              {/* Display account number suggestions */}
              {query && (
                <ul className="suggestions-list">
                  {suggestions.map((option, index) => (
                    <li key={index} onClick={() => handleOptionClick(option)}>
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <form id="myForm">
              {/* List box for people with access */}
              <select id="selectNumber">
                <option className="address">People With Access</option>
              </select>
            </form>
            <div className="footer">
              <button
                onClick={() => setModalOpen(false)}
                id="cancelBtn"
                className="button"
              >
                Cancel
              </button>
              <button onClick={() => sharing()} className="button">
                Share
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default Modal;

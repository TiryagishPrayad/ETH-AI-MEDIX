import React from 'react';
import useAddressInput from './useAddressInput';
import './Modal.css';

const Modal = ({ setModalOpen, contract }) => {
  const { query, handleInputChange, suggestions, selectedOption, handleOptionClick } = useAddressInput(contract);

  const sharing = async () => {
    const address = document.querySelector('.account-number-input').value;
    await contract.allow(address);
    setModalOpen(false);
  };

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

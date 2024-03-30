import React, { useState, useEffect } from "react";
import "./Feedback.css";

const Feedback = ({ contract, account, userName }) => {
  const [uploadedRecords, setUploadedRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  const [nameAddressMap, setNameAddressMap] = useState({});
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const handleInputChange = (event) => {
    const userInput = event.target.value;
    setQuery(userInput);
    setShowSuggestions(userInput !== '');
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
    setShowSuggestions(false);
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
        // console.log("Fetching name for address:", address);
        const name = await contract.getName(address);
        if (name) {
          map[address] = name;
          // console.log("Name found for address:", address, "Name:", name);
        }
      }
      setNameAddressMap(map);
      console.log("Name-Address Map:", map);
    };
    contract && fetchNames();
  }, [contract]);
  

  const fetchUploadedRecords = async () => {
    try {
      let records;
      if (query) {
        records = await contract.display(query);
      } else {
        records = await contract.display(account);
      }
      setUploadedRecords(records);
    } catch (error) {
      console.error("Error fetching uploaded records:", error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const feedbackCount = await contract.getFeedbackCount();
      const feedbackData = [];
      for (let i = 0; i < feedbackCount; i++) {
        const [user, record, feedback, username] = await contract.getFeedback(i);
        feedbackData.push({ user, record, feedback, username });
      }
      setSubmittedFeedback(feedbackData);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const submitFeedback = async () => {
    try {
      await contract.provideFeedback(selectedRecord, feedback, userName);
      setFeedback("");
      setSubmittedFeedback((prevFeedback) => [
        ...prevFeedback,
        {
          user: account, 
          username: userName, 
          record: selectedRecord,
          feedback: feedback,
        },
      ]);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const subscribeToFeedbackEvents = () => {
    if (contract) {
      contract.on("FeedbackProvided", (record, feedback, username) => {
        handleFeedbackProvided(record, feedback, username);
      });
    }
  };

  const handleFeedbackProvided = async (record, feedback, username) => {
    setSubmittedFeedback((prevFeedback) => [
      ...prevFeedback,
      {
        user: account, 
        username, 
        record,
        feedback,
      },
    ]);
  };

  useEffect(() => {
    fetchUploadedRecords();
    subscribeToFeedbackEvents();
    fetchFeedback();

    return () => {
      if (contract) {
        contract.off("FeedbackProvided", handleFeedbackProvided);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [contract, query]);

 
  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
  };

  const handleInputSubmit = () => {
    fetchUploadedRecords();
  };

  return (
    <div>
      <h2>Health Record Feedback</h2>
      <div className="body">
       
        <input
          type="text"
          className="address"
          value={query}
          onChange={handleInputChange}
          placeholder="Enter Account Name"
        />
        {query && (
          <ul className={`suggestions-list ${showSuggestions ? '' : 'hidden'}`}>
            {suggestions.map((option, index) => (
              <li key={index} onClick={() => handleOptionClick(option)}>
                {option}
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleInputSubmit} className="submit-button">Submit</button>
      </div>
      <div className="record-list">
        {uploadedRecords.map((record, index) => (
          <div key={index} className="record">
            <a href={record} target="_blank" rel="noopener noreferrer">
              {record}
            </a>
            <button onClick={() => handleSelectRecord(record)}>Select</button>
          </div>
        ))}
      </div>
      {selectedRecord && (
        <div className="feedback-section">
          <h3>Record: {selectedRecord}</h3>
          <div>
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Enter your feedback"
            />
            <button onClick={submitFeedback}>Submit Feedback</button>
          </div>
        </div>
      )}

      <div className="feedback-list">
        <h3>Feedback</h3>
        {submittedFeedback.length > 0 ? (
          submittedFeedback.map((feedback, index) => (
            <div key={index} className="feedback-item">
              <p>Address: {feedback.user}</p>
              <p>Name: {feedback.username}</p>
              <p> Patient Record: {feedback.record}</p>
              <p> Feedback: {feedback.feedback}</p>
            </div>
          ))
        ) : (
          <p>No feedback submitted.</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;

import React, { useState, useEffect } from "react";

const Feedback = ({ contract, account, userName }) => {
  const [uploadedRecords, setUploadedRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  const [inputAddress, setInputAddress] = useState("");

  const fetchUploadedRecords = async () => {
    try {
      let records;
      if (inputAddress) {
        records = await contract.display(inputAddress);
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
  }, [contract, inputAddress]);

  const handleAddressChange = (e) => {
    setInputAddress(e.target.value);
  };

  const handleAddressSubmit = () => {
    fetchUploadedRecords();
  };

  return (
    <div>
      <h2>Health Record Feedback</h2>
      <div>
        <input
          type="text"
          placeholder="Enter Address"
          value={inputAddress}
          onChange={handleAddressChange}
          className="address"
        />
        <button onClick={handleAddressSubmit}>Submit</button>
      </div>
      <div className="record-list">
        {uploadedRecords.map((record, index) => (
          <div
            key={index}
            className={`record ${
              selectedRecord === record ? "selected" : ""
            }`}
            onClick={() => handleRecordClick(record)}
          >
            <a href={record} target="_blank" rel="noopener noreferrer">
              {record}
            </a>
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

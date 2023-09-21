import React, { useState, useEffect } from "react";

const Feedback = ({ contract, account }) => {
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
      let feedbackData = await contract.getFeedback();
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
      await contract.provideFeedback(selectedRecord, feedback);
      setFeedback("");
      setSubmittedFeedback((prevFeedback) => [
        ...prevFeedback,
        {
          record: selectedRecord,
          feedback,
        },
      ]);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const subscribeToFeedbackEvents = () => {
    if (contract) {
      contract.on("FeedbackProvided", handleFeedbackProvided);
    }
  };

  const handleFeedbackProvided = (record, feedback) => {
    setSubmittedFeedback((prevFeedback) => [
      ...prevFeedback,
      {
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
            className={`record ${selectedRecord === record ? "selected" : ""}`}
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
              <p>User: {feedback.user}</p>
              <p>Record: {feedback.record}</p>
              <p>Feedback: {feedback.feedback}</p>
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

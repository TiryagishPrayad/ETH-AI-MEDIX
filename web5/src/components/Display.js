import { useState, useEffect } from "react";
import "./Display.css";
import useAddressInput from './useAddressInput';

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const { query, handleInputChange, suggestions, handleOptionClick } = useAddressInput(contract);
  const [diseasePredictions, setDiseasePredictions] = useState({
    decision_tree: "",
    random_forest: "",
    naive_bayes: "",
  });

  const fetchData = async (query) => {
    try {
      const dataArray = await contract.display(query || account);
      const isEmpty = dataArray.length === 0;

      if (!isEmpty) {
        const str = dataArray.join(",");
        const str_array = str.split(",");
        const images = str_array.map((item, i) => {
          return (
            <a href={item} key={i} target="_blank" rel="noreferrer">
              <img
                key={i}
                src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
                alt="Patient Health Record"
                className="image-list"
              ></img>
            </a>
          );
        });

        setData(images);
      } else {
        alert("No Record to display");
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  const getDiseasePredictions = async (query) => {
    try {
      const [decision_tree, random_forest, naive_bayes] = await contract.getDiseasePredictions(query || account);
      setDiseasePredictions({
        decision_tree,
        random_forest,
        naive_bayes,
      });
    } catch (error) {
      console.error(error);
      alert("Error fetching disease predictions: " + error.message);
    }
  };

  // useEffect(() => {
  //   if (query) {
  //     fetchData(query);
  //     getDiseasePredictions(query);
  //   }
  // }, [query]);

  return (
    <>
      <input
        type="text"
        className="account-dropdown"
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
      <br />
      <br />
      <button className="center button" onClick={() => fetchData(query)}>
        Get Patient Record
      </button>
      <button className="center button" onClick={() => getDiseasePredictions(query)}>
        Get Disease Predictions
      </button>

      <div className="image-list">{data}</div>
      {/* Display disease predictions */}
      <div className="disease-predictions">
        <h2>Disease Predictions</h2>
        <p>Decision Tree: {diseasePredictions.decision_tree}</p>
        <p>Random Forest: {diseasePredictions.random_forest}</p>
        <p>Naive Bayes: {diseasePredictions.naive_bayes}</p>
        
      </div>
    </>
  );
};

export default Display;

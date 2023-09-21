import { useState, useEffect } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const [diseasePredictions, setDiseasePredictions] = useState({
    decision_tree: "",
    random_forest: "",
    naive_bayes: "",
  });

  const fetchData = async (address) => {
    try {
      const dataArray = await contract.display(address || account);
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
              <span className="record-text">Patient Health Record</span>
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

  const getDiseasePredictions = async (address) => {
    try {
      const [decision_tree, random_forest, naive_bayes] = await contract.getDiseasePredictions(address || account );
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

  useEffect(() => {
    getDiseasePredictions(account); // Include 'account' as a dependency
  }, [account]);

  const handleGetDiseasePredictions = () => {
    const address = document.querySelector(".address").value;
    getDiseasePredictions(address );
  };

  return (
    <>
      <input type="text" placeholder="Enter Address" className="address" />
      <br /><br />
      <button className="center button" onClick={() => fetchData(document.querySelector(".address").value)}>
        Get Patient Record
      </button>
      <button className="center button" onClick={handleGetDiseasePredictions}>
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

import React, { useState } from 'react';
import axios from 'axios';

function DiseasePredictor({ contract, account }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState(['', '', '', '', '']);
  const [results, setResults] = useState({
    decision_tree: '',
    random_forest: '',
    naive_bayes: '',
  });

  const l1 = ['back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine',
  'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach',
  'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation',
  'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs',
  'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool',
  'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs',
  'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails',
  'swollen_extremities', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips',
  'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints',
  'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness',
  'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of urine',
  'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)',
  'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain',
  'abnormal_menstruation', 'dischromic _patches', 'watering_from_eyes', 'increased_appetite', 'polyuria',
  'family_history', 'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration', 'visual_disturbances',
  'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma', 'stomach_bleeding',
  'distention_of_abdomen', 'history_of_alcohol_consumption', 'fluid_overload', 'blood_in_sputum',
  'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads',
  'scurrying', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails',
  'blister', 'red_sore_around_nose', 'yellow_crust_ooze'

  ];


  // Function to handle symptom selection
  const handleSymptomChange = (event, index) => {
    const newSelectedSymptoms = [...selectedSymptoms];
    newSelectedSymptoms[index] = event.target.value;
    setSelectedSymptoms(newSelectedSymptoms);
  };

  const predictDisease = async () => {
    try {
      const response = await axios.post('http://localhost:5000/predict', { symptoms: selectedSymptoms });

      if (response.status === 200) {
        const data = response.data;
        setResults(data);

        await storeDiseasePredictionsInContract(data);
      } else {
        console.error('Network response was not ok');
        setResults({
          decision_tree: 'error',
          random_forest: 'error',
          naive_bayes: 'error',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setResults({
        decision_tree: 'error',
        random_forest: 'error',
        naive_bayes: 'error',
      });
    }
  };

  const storeDiseasePredictionsInContract = async (predictions) => {
    try {
      const tx = await contract.setDiseasePredictions(
        predictions.decision_tree_disease,
        predictions.random_forest_disease,
        predictions.naive_bayes_disease
      );
      console.log('Transaction Hash:', tx.hash);
      await tx.wait();
      console.log('Disease predictions stored on the smart contract');
    } catch (error) {
      console.error('Error storing disease predictions:', error);
    }
  };

  return (
    <div>
      <h1>Disease Predictor</h1>
      <label>Select Symptoms:</label>
      <br />
      {selectedSymptoms.map((selectedSymptom, index) => (
        <select key={`${selectedSymptom}-${index}`} onChange={(e) => handleSymptomChange(e, index)} value={selectedSymptom}>
          <option value="">Select Symptom</option>
          {l1.map((symptom, symptomIndex) => (
            <option key={`${symptom}-${symptomIndex}`} value={symptom}>
              {symptom}
            </option>
          ))}
        </select>
      ))}

      <br />
      <button onClick={predictDisease}>Predict Disease</button>
      {/* <p>
        Decision Tree: {results.decision_tree_disease}
        <br />
        Random Forest: {results.random_forest_disease}
        <br />
        Naive Bayes: {results.naive_bayes_disease}
      </p> */}
    </div>
  );
}

export default DiseasePredictor;

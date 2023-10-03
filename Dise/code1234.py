import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from flask import Flask, request, jsonify
from flask_cors import CORS
l1 = ['back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine',
      'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach',
      'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation',
      'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs',
      'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool',
      'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs',
      'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails',
      'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips',
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
      'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails',
      'blister', 'red_sore_around_nose', 'yellow_crust_ooze']

disease_list = ['Fungal infection', 'Allergy', 'GERD', 'Chronic cholestasis', 'Drug Reaction',
           'Peptic ulcer disease', 'AIDS', 'Diabetes', 'Gastroenteritis', 'Bronchial Asthma', 'Hypertension',
           'Migraine', 'Cervical spondylosis', 'Paralysis (brain hemorrhage)', 'Jaundice', 'Malaria',
           'Chicken pox', 'Dengue', 'Typhoid', 'hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D',
           'Hepatitis E', 'Alcoholic hepatitis', 'Tuberculosis', 'Common Cold', 'Pneumonia',
           'Dimorphic hemorrhoids(piles)', 'Heart attack', 'Varicose veins', 'Hypothyroidism', 'Hyperthyroidism',
           'Hypoglycemia', 'Osteoarthritis', 'Arthritis', '(vertigo) Paroxysmal Positional Vertigo', 'Acne',
           'Urinary tract infection', 'Psoriasis', 'Impetigo']


df = pd.read_csv("/Users/tiryagishprayad/Pictures/finalproject/Dise/Training.csv")
 

X = df[l1].values
y = df["prognosis"].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


app = Flask(__name__)


CORS(app)


def DecisionTree(symptoms):
    clf = DecisionTreeClassifier()
    clf = clf.fit(X_train, y_train)
    inputtest = [0] * len(l1)
    for k in range(0, len(l1)):
        for z in symptoms:
            if z == l1[k]:
                inputtest[k] = 1
    predict = clf.predict([inputtest])
    predicted_disease = disease_list.index(predict[0])
    return disease_list[predicted_disease], calculate_accuracy(clf, X_test, y_test)


def randomforest(symptoms):
    clf = RandomForestClassifier()
    clf = clf.fit(X_train, y_train)
    inputtest = [0] * len(l1)
    for k in range(0, len(l1)):
        for z in symptoms:
            if z == l1[k]:
                inputtest[k] = 1
    predict = clf.predict([inputtest])
    predicted_disease = disease_list.index(predict[0])
    return disease_list[predicted_disease], calculate_accuracy(clf, X_test, y_test)


def NaiveBayes(symptoms):
    clf = GaussianNB()
    clf = clf.fit(X_train, y_train)
    inputtest = [0] * len(l1)
    for k in range(0, len(l1)):
        for z in symptoms:
            if z == l1[k]:
                inputtest[k] = 1
    predict = clf.predict([inputtest])
    predicted_disease = disease_list.index(predict[0])
    return disease_list[predicted_disease], calculate_accuracy(clf, X_test, y_test)


def calculate_accuracy(model, X_test, y_test):
    y_pred = model.predict(X_test)
    return accuracy_score(y_test, y_pred)

@app.route('/predict', methods=['POST'])
def predict_disease():
    data = request.json 
    symptoms = data.get('symptoms', [])  
    decision_tree_disease, decision_tree_accuracy = DecisionTree(symptoms)
    random_forest_disease, random_forest_accuracy = randomforest(symptoms)
    naive_bayes_disease, naive_bayes_accuracy = NaiveBayes(symptoms)
    return jsonify({
        'decision_tree_disease': decision_tree_disease,
        'decision_tree_accuracy': decision_tree_accuracy,
        'random_forest_disease': random_forest_disease,
        'random_forest_accuracy': random_forest_accuracy,
        'naive_bayes_disease': naive_bayes_disease,
        'naive_bayes_accuracy': naive_bayes_accuracy
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

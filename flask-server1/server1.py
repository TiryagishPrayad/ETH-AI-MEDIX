from flask import Flask, request, jsonify
from flask_cors import CORS 
app = Flask(__name__)
CORS(app) 

@app.route('/', methods=['POST'])
def calculate():
    data = request.get_json()
    a = data.get('a')
    b = data.get('b')

    try:
        
        a = float(a)
        b = float(b)
        result = a + b

       
        return jsonify(result=result)

    except ValueError:
        
        return jsonify(error="Invalid input. 'a' and 'b' must be numbers."), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)

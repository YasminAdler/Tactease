from flask import Flask, jsonify
import requests  # Import the requests library
from cpAlgorithmModuled import generate_mission_schedule
import json

app = Flask(__name__)

# Replace these URLs with the actual URLs of your Node server
SCHEDULE_URL = 'http://localhost:3030/schedule'

@app.route('/')
# def home():
#     # Fetch missions JSON data
#     missions_response = requests.get(MISSIONS_URL)
#     missions_json = missions_response.json() if missions_response.status_code == 200 else []

#     # Fetch soldiers JSON data
#     soldiers_response = requests.get(SOLDIERS_URL)
#     soldiers_json = soldiers_response.json() if soldiers_response.status_code == 200 else []

#     # Generate mission schedule
#     schedule = generate_mission_schedule(missions_json, soldiers_json)

#     # Assuming generate_mission_schedule returns a JSON string
#     # Convert the string back to a dictionary to use with jsonify
#     schedule_dict = jsonify(schedule)  # If schedule is already a dict, just pass it directly

#     return schedule_dict

@app.route('/schedule')
def schedule():
    req = requests.get_json()
    missions_response = req[0]
    soldiers_response = req[1]
    result = generate_mission_schedule(missions_response, soldiers_response)
    return json.dumps(result)

def other_page(page_name):
    response = 'The page named {page_name} does not exist.'
    return response

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify, abort
from flask_pymongo import PyMongo
# from bson.objectid import ObjectId
from werkzeug.exceptions import NotFound, BadRequest
from cpAlgorithmModuled import generate_mission_schedule, add_new_mission_with_soldiers
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://tacteaseDB:<password>@cluster0.lbyyky0.mongodb.net/"
mongo = PyMongo(app)


@app.route('/generate_schedule', methods=['POST'])
def generate_schedule():
    data = request.json
    missions_json_str = data['missions']
    soldiers_json_str = data['soldiers']
    schedule = generate_mission_schedule(missions_json_str, soldiers_json_str)
    return jsonify(schedule)

@app.route('/add_mission', methods=['POST'])
def add_mission():
    data = request.json
    schedule_json = data['schedule']
    new_mission_details = data['new_mission']
    soldiers_json_str = data['soldiers']
    updated_schedule = add_new_mission_with_soldiers(schedule_json, new_mission_details, soldiers_json_str)
    return jsonify(updated_schedule)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

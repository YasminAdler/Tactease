from flask import Flask, request, jsonify, abort
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.exceptions import NotFound, BadRequest

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://tacteaseDB:<password>@cluster0.lbyyky0.mongodb.net/"
mongo = PyMongo(app)

@app.route('/missions', methods=['GET'])
def get_missions():
    missions = mongo.db.missions.find()
    return jsonify([mission for mission in missions])

@app.route('/missions/<missionId>', methods=['GET'])
def get_mission_by_id(missionId):
    if not ObjectId.is_valid(missionId):
        raise BadRequest(description='Invalid mission ID')
    mission = mongo.db.missions.find_one_or_404({'_id': ObjectId(missionId)})
    return jsonify(mission)

@app.route('/missions', methods=['POST'])
def add_mission():
    data = request.json
    if not data:
        raise BadRequest(description='No input data provided')
    result = mongo.db.missions.insert_one(data)
    return jsonify({'_id': str(result.inserted_id)}), 201

@app.route('/missions/<missionId>', methods=['PUT'])
def update_mission(missionId):
    data = request.json
    if not ObjectId.is_valid(missionId) or not data:
        raise BadRequest(description='Invalid mission ID or no update data provided')
    mongo.db.missions.update_one({'_id': ObjectId(missionId)}, {'$set': data})
    return jsonify(message='Mission updated successfully')

@app.route('/missions/<missionId>', methods=['DELETE'])
def delete_mission(missionId):
    if not ObjectId.is_valid(missionId):
        raise BadRequest(description='Invalid mission ID')
    result = mongo.db.missions.delete_one({'_id': ObjectId(missionId)})
    if result.deleted_count:
        return jsonify(message='Mission deleted successfully')
    else:
        raise NotFound(description=f'Mission with ID {missionId} not found')
@app.errorhandler(NotFound)
def handle_not_found(error):
    return jsonify(error=str(error)), 404

@app.errorhandler(BadRequest)
def handle_bad_request(error):
    return jsonify(error=str(error)), 400

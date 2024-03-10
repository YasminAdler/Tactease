from datetime import datetime, timedelta
from classes.mission import Mission
from classes.soldier import Soldier
from classes.request import Request, PersonalRequest, MedicalRequest

def getMissions(missions_data):
    missions = []
    for mission_data in missions_data:
        mission = Mission(
            missionId=str(mission_data["_id"]),
            missionType=mission_data["missionType"],
            startDate=mission_data["startDate"],
            endDate=mission_data["endDate"],
            soldierCount=int(mission_data["soldierCount"]),
            soldiersOnMission=mission_data.get("soldiersOnMission", [])
        )
        missions.append(mission)
    return missions

def getSoldiers(soldiers_data):
    soldiers = []
    for soldier_data in soldiers_data:
        soldier = Soldier(
            personalNumber=int(soldier_data["personalNumber"]),
            fullName=str(soldier_data["fullName"]),
            classId=int(soldier_data['depClass']['classId']),
            className=str(soldier_data['depClass']["className"]),
            pakal=str(soldier_data["pakal"]),
            # Assuming requestList contains mission assignment info; adapt as necessary
            )
        soldiers.append(soldier)
    return soldiers

def getRequests(requests_data):
    requests = []
    for request_data in requests_data:
        # Check if it's a MedicalRequest or PersonalRequest by checking for 'file' and 'fileName'
        if 'file' in request_data and 'fileName' in request_data:
            request = MedicalRequest(
                requestType=request_data["requestType"],
                daysOffType=request_data["daysOffType"],
                start_date=request_data["start_date"],
                end_date=request_data["end_date"],
                file=request_data["file"],
                fileName=request_data["fileName"]
            )
        elif 'note' in request_data:
            request = PersonalRequest(
                requestType=request_data["requestType"],
                daysOffType=request_data["daysOffType"],
                start_date=request_data["start_date"],
                end_date=request_data["end_date"],
                note=request_data["note"]
            )
        else:
            # Handle generic requests or log an error/warning
            request = Request(
                requestType=request_data["requestType"],
                daysOffType=request_data["daysOffType"],
                start_date=request_data["start_date"],
                end_date=request_data["end_date"]
            )
        requests.append(request)
    return requests

def parseRequests(requestList):
    requests = []
    for request_data in requestList:
        request = Request(
            requestType=request_data["requestType"],
            daysOffType=request_data["daysOffType"],
            start_date=request_data["startDate"],
            end_date=request_data["endDate"],
            note=request_data.get("note"),
            fileName=request_data.get("fileName")
        )
        requests.append(request)
    return requests

def datetime_to_hours(datetime_input):
    """Function to convert datetime strings to a consistent unit (e.g., hours)"""
    datetime_format = "%d/%m/%Y %H:%M"
    reference_datetime = datetime.strptime("01/01/2024 00:00", datetime_format)
    if isinstance(datetime_input, datetime):
        current_datetime = datetime_input
    else:
        current_datetime = datetime.strptime(datetime_input, datetime_format)
    duration_hours = round(
        (current_datetime - reference_datetime).total_seconds()/(3600))
    return duration_hours


def hours_to_datetime(duration_hours):
    datetime_format = "%d/%m/%Y %H:%M"
    reference_datetime = datetime.strptime("01/01/2024 00:00", datetime_format)
    resulting_datetime = reference_datetime + timedelta(hours=duration_hours)
    return resulting_datetime.strftime(datetime_format)
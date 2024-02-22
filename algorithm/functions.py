from datetime import datetime, timedelta
from classes.mission import Mission
from classes.soldier import Soldier

def getMissions(missions_data):
    missions = []
    for mission_data in missions_data:
        parsedDateStart = datetime.fromisoformat(mission_data["startDate"].replace('Z', '+00:00'))  # Convert to datetime object
        parsedDateEnd = datetime.fromisoformat(mission_data["endDate"].replace('Z', '+00:00'))  # Convert to datetime object
        mission = Mission(
            missionId=str(mission_data["_id"]),
            missionType=mission_data["missionType"],
            startDate= parsedDateStart.strftime('%d/%m/%Y %H:%M'),
            endDate= parsedDateEnd.strftime('%d/%m/%Y %H:%M'),
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
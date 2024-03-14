from datetime import datetime, timedelta
from classes.mission import Mission
from classes.soldier import Soldier

def getMissions(missions_data):
    missions = []
    try:
        for inputMission in missions_data:
            mission = Mission(
                missionId=str(inputMission["_id"]),
                missionType=inputMission["missionType"],
                startDate= inputMission["startDate"],
                endDate= inputMission["endDate"],
                soldierCount=int(inputMission["soldierCount"]),
                soldiersOnMission=inputMission["soldiersOnMission"]
            )
            missions.append(mission)
        return missions
    except Exception as e:
        print("Error occurred:", e)


def getSoldiers(soldiers_data):
    soldiers = []
    for soldierInput in soldiers_data:
        soldier = Soldier(
            personalNumber=int(soldierInput["personalNumber"]),  # Change soldier_data.personalNumber to soldier_data["personalNumber"]
            fullName=str(soldierInput["fullName"]),  # Change soldier_data.fullName to soldier_data["fullName"]
            classId=int(soldierInput["depClass"]["classId"]),  # Change soldier_data.depClass.classId to soldier_data["depClass"]["classId"]
            className=str(soldierInput["depClass"]["className"]),  # Change soldier_data.depClass.className to soldier_data["depClass"]["className"]
            pakal=str(soldierInput["pakal"]),  # Change soldier_data.pakal to soldier_data["pakal"]
        )
        soldiers.append(soldier)
    return soldiers







# def getMissions(missions_data):
#     missions = []
#     try:
#         with open('algorithm/mission_data.txt', 'a') as f:
#             f.write(mission_data)
#         for mission in missions_data:
#             mission = Mission(
#                 missionId=str(mission_data._id),
#                 missionType=mission_data.missionType,
#                 startDate= mission_data.startDate,
#                 endDate= mission_data.startEnd,
#                 soldierCount=int(mission_data.soldierCount),
#                 soldiersOnMission=mission_data.soldiersOnMission
#             )
#             missions.append(mission)
#     except Exception as e:
#         print("Error occurred:", e)
#     return missions


# def getSoldiers(soldiers_data):
#     soldiers = []
#     for soldier_data in soldiers_data:
#         soldier = Soldier(
#             personalNumber=int(soldier_data.personalNumber),
#             fullName=str(soldier_data.fullName),
#             classId=int(soldier_data.depClass.classId),
#             className=str(soldier_data.depClass.className),
#             pakal=str(soldier_data.pakal),
#             )
#         soldiers.append(soldier)
#     return soldiers


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
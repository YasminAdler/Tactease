from ortools.sat.python import cp_model
import json
from datetime import datetime

# Path to your JSON file
file_path = 'temp-missions.json'

# Reading the JSON file
with open(file_path, 'r') as file:
        missions_data = json.load(file)

from classes.mission import Mission
# from classes.soldier import Soldier
# from classes.request import Request
# from classes.schedule import Schedule

missions = []

for mission_data in missions_data:
    mission = Mission(
        missionId=mission_data["missionId"],
        missionType=mission_data["missionType"],
        startDate=mission_data["startDate"],
        endDate=mission_data["endDate"],
        soldierCount=mission_data["soldierCount"],
        soldiersOnMission=mission_data.get("soldiersOnMission", [])  # Use .get() to handle missing keys
    )
    missions.append(mission)

# Function to convert datetime strings to a consistent unit (e.g., hours)
# def datetime_to_hours(datetime_str):
#     datetime_format = "%d/%m/%Y %H:%M"
#     reference_datetime = datetime.strptime("01/01/2024 00:00", datetime_format)  # Adjust as needed
#     current_datetime = datetime.strptime(datetime_str, datetime_format)
#     duration_hours = (current_datetime - reference_datetime).total_seconds() / 3600
#     return duration_hours
#
# # Create an IntervalVar for each mission
# mission_intervals = {}
# for mission in missions:
#     start_hours = datetime_to_hours(mission.startDate)
#     end_hours = datetime_to_hours(mission.endDate)
#     duration_hours = end_hours - start_hours
#     mission_intervals[mission.missionId] = model.NewIntervalVar(
#         start_hours,  # Start
#         duration_hours,  # Size
#         end_hours,  # End
#         f'mission_interval_{mission.missionId}'  # Name
#     )
#
# # Add a non-overlapping constraint for all missions
# model.AddNoOverlap(mission_intervals.values())
#
# solver = cp_model.CpSolver()
# status = solver.Solve(model)
#
# if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
#     print("Solution Found:")
#     for mission in missions:
#         interval_var = mission_intervals[mission.missionId]
#         print(f"Mission {mission.missionId} starts at {solver.Value(interval_var.StartExpr())} hours")
# else:
#     print("No solution was found.")

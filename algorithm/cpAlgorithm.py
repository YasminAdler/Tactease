from ortools.sat.python import cp_model
import json
from datetime import datetime

# Path to your JSON file
file_path = 'C:/Users/adler/OneDrive - Shenkar College/SCHOOL/Year3SM1/שיטות בהנדסת תוכנה/Tactease/algorithm/temp-missions.json'
model = cp_model.CpModel()

# Reading the JSON file
with open(file_path, 'r') as file:
    missions_data = json.load(file)

from classes.mission import Mission

missions = []

for mission_data in missions_data:
    mission = Mission(
        missionId=str(mission_data["missionId"]),
        missionType=mission_data["missionType"],
        startDate=mission_data["startDate"],
        endDate=mission_data["endDate"],
        soldierCount=int(mission_data["soldierCount"]),
        soldiersOnMission=mission_data.get("soldiersOnMission", [])
    )
    missions.append(mission)

# Function to convert datetime strings to a consistent unit (e.g., hours)
def datetime_to_hours(datetime_input):
    datetime_format = "%d/%m/%Y %H:%M"
    reference_datetime = datetime.strptime("01/01/2024 00:00", datetime_format)
    if isinstance(datetime_input, datetime):
        current_datetime = datetime_input
    else:
        current_datetime = datetime.strptime(datetime_input, datetime_format)
    duration_hours = round((current_datetime - reference_datetime).total_seconds() / 3600)
    return duration_hours

mission_intervals = {}

# Create an IntervalVar for each mission
for mission in missions:
    start_hours = datetime_to_hours(mission.startDate)
    end_hours = datetime_to_hours(mission.endDate)
    duration_hours = end_hours - start_hours
    missionId_key = str(mission.missionId)
    mission_intervals[missionId_key] = model.NewIntervalVar(
        start_hours,  # Start
        duration_hours,  # Size
        end_hours,  # End
        f'mission_interval_{missionId_key}'  # Name
    )

# Add a non-overlapping constraint for all missions
# model.AddNoOverlap(mission_intervals.values())
solver = cp_model.CpSolver()
status = solver.Solve(model)

if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
    print("Solution Found:")
    # Debug: Print all keys in mission_intervals for verification
    print("Keys in mission_intervals:", list(mission_intervals.keys()))
    for mission in missions:
        missionId_key = str(mission.missionId)
        if missionId_key in mission_intervals:
            interval_var = mission_intervals[missionId_key]
            print(f"Mission {mission.missionId} starts at {solver.Value(interval_var.StartExpr())} hours")
        else:
            print(f"Mission ID {missionId_key} not found in mission_intervals")
else:
    print("No solution was found.")

from classes.mission import Mission
from ortools.sat.python import cp_model
import json
from datetime import datetime, timedelta
from classes.soldier import Soldier
from functions import getMissions, getSoldiers, datetime_to_hours, hours_to_datetime

MIN_REST_HOURS = 7  # Minimal resting time in hours
OBSERVATION_PERIOD_HOURS = 24  # Observation window (24 hours)


file_path = 'C:/Users/adler/OneDrive - Shenkar College/SCHOOL/Year3SM1/שיטות בהנדסת תוכנה/Tactease/algorithm/temp-missions.json'
file_path_soldier = 'C:/Users/adler/OneDrive - Shenkar College/SCHOOL/Year3SM1/שיטות בהנדסת תוכנה/Tactease/algorithm/temp-db.json'


with open(file_path, 'r') as file:
    missions_data = json.load(file)

missions = getMissions(missions_data)

with open(file_path_soldier, 'r') as file:
    soldiers_data = json.load(file)


soldiers = getSoldiers(soldiers_data)

model = cp_model.CpModel()

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

# Create a BoolVar for each soldier-mission pair
soldier_mission_vars = {}
for soldier in soldiers:
    for mission in missions:
        missionId_key = str(mission.missionId)
        soldierId_key = str(soldier.personalNumber)
        soldier_mission_vars[(soldierId_key, missionId_key)] = model.NewBoolVar(
            f'soldier_{soldierId_key}_mission_{missionId_key}'
        )

# Constraint: Each mission must be assigned at least one soldier
for missionId_key, interval_var in mission_intervals.items():
    required_soldiers = next((mission.soldierCount for mission in missions if str(mission.missionId) == missionId_key), None)
    if required_soldiers is not None:
        model.Add(sum(soldier_mission_vars[(str(soldier.personalNumber), missionId_key)] for soldier in soldiers) == required_soldiers)


# Constraint: Each soldier must be assigned at most two mission at a time
for soldierId_key in [str(soldier.personalNumber) for soldier in soldiers]:
    model.Add(sum(soldier_mission_vars[(soldierId_key, missionId_key)] for missionId_key in mission_intervals.keys()) <= 2)

# Add additional constraints as needed (e.g., soldier availability, mission requirements)

solver = cp_model.CpSolver()
status = solver.Solve(model)

if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
    print("Solution Found:")
    for mission in missions:
        missionId_key = str(mission.missionId)
        if missionId_key in mission_intervals:
            interval_var = mission_intervals[missionId_key]
            start_hours = solver.Value(interval_var.StartExpr())
            start_datetime = hours_to_datetime(start_hours)
            assigned_soldiers = []
            for soldier in soldiers:
                soldierId_key = str(soldier.personalNumber)
                if solver.BooleanValue(soldier_mission_vars[(soldierId_key, missionId_key)]):
                    assigned_soldiers.append(soldier)
            print(f"Mission {mission.missionId} starts at {start_datetime}. Assigned Soldiers: {[soldier.fullName for soldier in assigned_soldiers]}")
        else:
            print(f"Mission ID {missionId_key} not found in mission_intervals")
else:
    print("No solution was found.")


# if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
#     print("Solution Found:")
#     for mission in missions:
#         missionId_key = str(mission.missionId)
#         if missionId_key in mission_intervals:
#             interval_var = mission_intervals[missionId_key]
#             start_hours = solver.Value(interval_var.StartExpr())
#             start_datetime = hours_to_datetime(start_hours)
#             assigned_soldiers = []
#             for soldier in soldiers:
#                 soldierId_key = str(soldier.personalNumber)
#                 if solver.BooleanValue(soldier_mission_vars[(soldierId_key, missionId_key)]):
#                     assigned_soldier = soldier
#                     break
#             if assigned_soldier:
#                 print(f"Mission {mission.missionId} starts at {start_datetime}. Assigned Soldiers: {[soldier.name for soldier in assigned_soldiers]}")
#             else:
#                 print(f"Mission {mission.missionId} starts at {start_datetime}. No soldier assigned.")
#         else:
#             print(f"Mission ID {missionId_key} not found in mission_intervals")
# else:
#     print("No solution was found.")


# if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
#     print("Solution Found:")
#     # Debug: Print all keys in mission_intervals for verification
#     print("Keys in mission_intervals:", list(mission_intervals.keys()))
#     for mission in missions:
#         missionId_key = str(mission.missionId)
#         if missionId_key in mission_intervals:
#             interval_var = mission_intervals[missionId_key]
#             start_hours = solver.Value(interval_var.StartExpr())
#             start_datetime = hours_to_datetime(start_hours)
#             print(f"Mission {mission.missionId} starts at {start_datetime}")
#         else:
#             print(f"Mission ID {missionId_key} not found in mission_intervals")
# else:
#     print("No solution was found.")



# for soldier in soldiers:
#     print(soldier)
    
    
    

    
    

# # Assuming min_rest_period is in days; convert to hours
# min_rest_period_hours = min_rest_period * 24

# # Iterate over soldiers to set constraints on their assigned missions
# for soldier in soldiers:
#     # Ensure missions_assigned is a list of mission IDs from soldier's requestList
#     missions_assigned = [request.missionId for request in soldier.requestList]

#     # Sort missions by their start time to ensure we're enforcing rest between consecutive missions
#     missions_assigned_sorted = sorted(missions_assigned, key=lambda x: datetime_to_hours(missions[x].startDate))

#     for i in range(len(missions_assigned_sorted) - 1):
#         current_mission_id = missions_assigned_sorted[i]
#         next_mission_id = missions_assigned_sorted[i+1]

#         # Ensure we have interval variables for these missions
#         if current_mission_id in mission_intervals and next_mission_id in mission_intervals:
#             current_mission_end = mission_intervals[current_mission_id].EndExpr()
#             next_mission_start = mission_intervals[next_mission_id].StartExpr()

#             # Enforce minimum rest period between missions
#             model.Add(next_mission_start - current_mission_end >= min_rest_period_hours)

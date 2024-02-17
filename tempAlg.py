from classes.mission import Mission
from ortools.sat.python import cp_model
import json
from datetime import datetime, timedelta
from classes.soldier import Soldier
from functions import getMissions, getSoldiers, datetime_to_hours, hours_to_datetime

MIN_REST_HOURS = 7  # Minimal resting time in hours
OBSERVATION_PERIOD_HOURS = 48 # 7 days
no_two_missions_consecutively_flag = 1
Enable = 1
Disable = 0

file_path = 'C:/Users/adler/OneDrive - Shenkar College/SCHOOL/Year3SM1/שיטות בהנדסת תוכנה/Tactease/algorithm/5missionaday.json'
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
        
def dis_en_able_constraints(flag, action):
    flag = action


# Constraint: Each mission must be assigned at least one soldier and by required soldiers number for the mission
for missionId_key, interval_var in mission_intervals.items():
    required_soldiers = next((mission.soldierCount for mission in missions if str(mission.missionId) == missionId_key), None)
    if required_soldiers is not None:
        model.Add(sum(soldier_mission_vars[(str(soldier.personalNumber), missionId_key)] for soldier in soldiers) == required_soldiers)

# constraint: a soldier cannot be assigned to more than 1 mission at a time:
def missions_overlap(mission1_id, mission2_id):
    start1, end1 = mission_intervals[mission1_id].StartExpr(), mission_intervals[mission1_id].EndExpr()
    start2, end2 = mission_intervals[mission2_id].StartExpr(), mission_intervals[mission2_id].EndExpr()
    return (start1 < end2) and (start2 < end1)

for soldier in soldiers:
    soldier_id = str(soldier.personalNumber)
    for mission1_id in mission_intervals.keys():
        for mission2_id in mission_intervals.keys():
            if mission1_id < mission2_id:  # To avoid redundant checks and self-comparison
                if missions_overlap(mission1_id, mission2_id):
                    # Ensuring a soldier cannot be assigned to both missions if they overlap
                    model.AddBoolOr([
                        soldier_mission_vars[(soldier_id, mission1_id)].Not(),
                        soldier_mission_vars[(soldier_id, mission2_id)].Not()
                    ])

# # end of constraint - one mission at a time

# Constraint: A soldier cannot be assigned to back to back missions
# if(no_two_missions_consecutively_flag == Enable):
# # Function to add constraint preventing soldiers from being in consecutive missions
#     def add_non_consecutive_mission_constraint(model, soldiers, missions, soldier_mission_vars, mission_intervals):
#         for soldier in soldiers:
#             soldier_id = str(soldier.personalNumber)
#             for mission1_id in mission_intervals.keys():
#                 for mission2_id in mission_intervals.keys():
#                     if mission1_id != mission2_id:
#                         end_of_mission1 = mission_intervals[mission1_id].EndExpr()
#                         start_of_mission2 = mission_intervals[mission2_id].StartExpr()
#                         # Ensuring there is a gap between the missions by adding a logical implication
#                         model.AddImplication(
#                             soldier_mission_vars[(soldier_id, mission1_id)],
#                             start_of_mission2 > end_of_mission1
#                         ).OnlyEnforceIf(soldier_mission_vars[(soldier_id, mission2_id)])

#     # Call the function to add the constraint to your model
#     add_non_consecutive_mission_constraint(model, soldiers, missions, soldier_mission_vars, mission_intervals)

# end of constraint: no two missions consecutively 

solver = cp_model.CpSolver()
status = solver.Solve(model)

if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
    print("Solution Found:")
    missions_details = []
    for mission in missions:
        missionId_key = str(mission.missionId)
        if missionId_key in mission_intervals:
            interval_var = mission_intervals[missionId_key]
            start_hours = solver.Value(interval_var.StartExpr())
            end_hours = solver.Value(interval_var.EndExpr())
            start_datetime = hours_to_datetime(start_hours)
            end_datetime = hours_to_datetime(end_hours)
            assigned_soldiers = []
            for soldier in soldiers:
                soldierId_key = str(soldier.personalNumber)
                if solver.BooleanValue(soldier_mission_vars[(soldierId_key, missionId_key)]):
                    assigned_soldiers.append(soldier.fullName)  # Storing soldier's full name directly
            # Append tuple with mission ID, start datetime, and list of assigned soldiers
            missions_details.append((missionId_key, start_datetime, end_datetime, assigned_soldiers))
        else:
            print(f"Mission ID {missionId_key} not found in mission_intervals")

    # Sort missions by start dateti  q  me
    missions_details.sort(key=lambda x: x[1])

    # Print sorted missions
    for mission_detail in missions_details:
        missionId_key, start_datetime, end_datetime, assigned_soldiers = mission_detail
        print(f"Mission {missionId_key} starts at {start_datetime} and ends at {end_datetime}. Assigned Soldiers: {assigned_soldiers}")
else:
    print("No solution was found.")
    print("Solver status:", status)
    print("Solver statistics:")
    print(solver.ResponseStats())
        
    
    
    
    
    
    
# if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
#     # Assuming you want to check for a soldier with a specific ID
#     specific_soldier_id = '1234567'  # Example soldier ID
#     assigned_missions = []  # List to hold missions assigned to the specific soldier

#     for mission in missions:
#         missionId_key = str(mission.missionId)
#         if solver.Value(soldier_mission_vars[(specific_soldier_id, missionId_key)]):
#             # If the solver indicates the soldier is assigned to this mission, record the mission
#             assigned_missions.append(mission)

#     # Now, assigned_missions contains all missions that the specific soldier is assigned to
#     # You can print these missions or process them further
#     print(f"Soldier {specific_soldier_id} is assigned to the following missions:")
#     for mission in assigned_missions:
#         print(f"Mission ID: {mission.missionId}, Start: {mission.startDate}, End: {mission.endDate}")
# else:
#     print("No solution was found, or the model was not solved successfully.")



    
    

    
    

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

from classes.mission import Mission
from ortools.sat.python import cp_model
import json
from datetime import datetime, timedelta
from classes.soldier import Soldier
from functions import getMissions, getSoldiers, datetime_to_hours, hours_to_datetime

MIN_REST_HOURS = 6  # Minimal resting time in hours
# OBSERVATION_PERIOD_HOURS = 24  # 1 day
# Enable = 1
# Disable = 0

file_path = 'C:/Users/adler/OneDrive - Shenkar College/SCHOOL/Year3SM1/שיטות בהנדסת תוכנה/Tactease/algorithm/5missionaday.json'
file_path_soldier = 'C:/Users/adler/OneDrive - Shenkar College/SCHOOL/Year3SM1/שיטות בהנדסת תוכנה/Tactease/algorithm/temp-soldiers.json'

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
    required_soldiers = next((mission.soldierCount for mission in missions if str(
        mission.missionId) == missionId_key), None)
    if required_soldiers is not None:
        model.Add(sum(soldier_mission_vars[(str(
            soldier.personalNumber), missionId_key)] for soldier in soldiers) == required_soldiers)


# constraint: a soldier cannot be assigned to more than 1 mission at a time:
def missions_overlap(mission1_id, mission2_id):
    start1, end1 = mission_intervals[mission1_id].StartExpr(), mission_intervals[mission1_id].EndExpr()
    start2, end2 = mission_intervals[mission2_id].StartExpr(), mission_intervals[mission2_id].EndExpr()
    return (start1 < end2) and (start2 < end1)

# Constraint: a soldier must have a 6 hour break between each mission

# def soldier_break(mission1_id, mission2_id):
#     end1 = mission_intervals[mission1_id].EndExpr()
#     start2 = mission_intervals[mission2_id].StartExpr()
#     return (start2 - end1 < MIN_REST_HOURS)

soldier_assigned_vars = {}
for soldier in soldiers:
    soldier_id = str(soldier.personalNumber)
    # This variable is 1 if the soldier is assigned to any mission, 0 otherwise
    soldier_assigned_vars[soldier_id] = model.NewBoolVar(f'soldier_assigned_{soldier_id}')


# constraint : Soldiers should be assigned equally
for soldier_id in soldier_assigned_vars:
    # Attempt to ensure every soldier has at least one mission assigned
    model.Add(sum(soldier_mission_vars[(soldier_id, missionId_key)] for missionId_key in mission_intervals) >= 1)

missions_assigned_to_soldier = [soldier_mission_vars[(soldier_id, missionId_key)] for missionId_key in mission_intervals]
model.AddMaxEquality(soldier_assigned_vars[soldier_id], missions_assigned_to_soldier)


# try: constraint: fair durations:


# end of constraint fair durations

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
                # if soldier_break(mission1_id, mission2_id):
                #     model.AddBoolOr([
                #         soldier_mission_vars[(soldier_id, mission1_id)].Not(),
                #         soldier_mission_vars[(soldier_id, mission2_id)].Not()
                #     ])

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
                    # Storing soldier's full name directly
                    assigned_soldiers.append(soldier.fullName)
            # Append tuple with mission ID, start datetime, and list of assigned soldiers
            missions_details.append(
                (missionId_key, start_datetime, end_datetime, assigned_soldiers))
        else:
            print(f"Mission ID {missionId_key} not found in mission_intervals")

    # Sort missions by start dateti  q  me
    missions_details.sort(key=lambda x: x[1])

    # Print sorted missions
    for mission_detail in missions_details:
        missionId_key, start_datetime, end_datetime, assigned_soldiers = mission_detail
        print(
            f"Mission {missionId_key} starts at {start_datetime} and ends at {end_datetime}. Assigned Soldiers: {assigned_soldiers}")
else:
    print("No solution was found.")
    print("Solver status:", status)
    print("Solver statistics:")
    print(solver.ResponseStats())

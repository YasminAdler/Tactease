import json
from datetime import datetime, timedelta


def calculate_duration(start, end):
    fmt = '%d/%m/%Y %H:%M'
    start_dt = datetime.strptime(start, fmt)
    end_dt = datetime.strptime(end, fmt)
    return (end_dt - start_dt).total_seconds() / 3600

def calculate_total_mission_hours(schedule):
    soldier_hours = {}
    for mission in schedule:
        mission_start = parse_datetime(mission["startDate"])
        mission_end = parse_datetime(mission["endDate"])
        duration = (mission_end - mission_start).total_seconds() / 3600
        for soldier in mission["soldiersOnMission"]:
            if soldier not in soldier_hours:
                soldier_hours[soldier] = 0
            soldier_hours[soldier] += duration
    return soldier_hours

def calculate_solder_mission_hours(missions):
    soldier_mission_hours = {}
    for mission in missions:
        mission_duration = calculate_duration(mission["startDate"], mission["endDate"])
        mission_day = datetime.strptime(mission["startDate"], '%d/%m/%Y %H:%M').date()
        
        for soldier_number in mission["soldiersOnMission"]:
            if soldier_number not in soldier_mission_hours:
                soldier_mission_hours[soldier_number] = {}
            if mission_day not in soldier_mission_hours[soldier_number]:
                soldier_mission_hours[soldier_number][mission_day] = 0
            soldier_mission_hours[soldier_number][mission_day] += mission_duration
    return soldier_mission_hours  # Ensure this dictionary is returned


def parse_datetime(date_str):
    return datetime.strptime(date_str, '%d/%m/%Y %H:%M')

def find_available_soldiers(schedule, newMission):
    new_mission_start = parse_datetime(newMission["startDate"])
    new_mission_end = parse_datetime(newMission["endDate"])
    buffer_time = timedelta(hours=4)
    
    # Calculate total mission hours for prioritization
    soldier_hours = calculate_total_mission_hours(schedule)
    # Sort soldiers by total mission hours (ascending)
    sorted_soldiers = sorted(soldier_hours.items(), key=lambda x: x[1])
    
    available_soldiers = []
    
    for soldier, _ in sorted_soldiers:
        soldier_is_available = True
        for mission in schedule:
            if soldier in mission["soldiersOnMission"]:
                mission_start = parse_datetime(mission["startDate"])
                mission_end = parse_datetime(mission["endDate"])
                # Adjusted overlap check with buffer time
                if not (new_mission_end + buffer_time <= mission_start or new_mission_start - buffer_time >= mission_end):
                    soldier_is_available = False
                    break
        if soldier_is_available:
            available_soldiers.append(soldier)
    
    return available_soldiers


def find_min_hours_soldier_for_day(soldier_mission_hours, specific_day):
    min_hours = None
    
    soldiers_hours = []
    for soldier, days in soldier_mission_hours.items():
        if specific_day in days:
            soldiers_hours.append((soldier, days[specific_day]))
    
    for soldier, days in soldier_mission_hours.items():
        if specific_day in days:
            if min_hours is None or days[specific_day] < min_hours:
                min_hours = days[specific_day]
                soldier_with_min_hours = soldier
    
    soldiers_hours.sort(key=lambda x: x[1])
                
    if soldiers_hours is not None:
        return soldiers_hours[:3]
    else:
        return None
    
def update_mission_schedule(schedule_json_str, missionID, soldier_to_add, soldier_to_remove):
    # Load the schedule from JSON
    missions = json.loads(schedule_json_str)
    
    # Find the mission by missionID and replace the soldier
    for mission in missions:
        if mission["missionId"] == missionID:
            try:
                # Find the index of the soldier to remove
                index_to_replace = mission["soldiersOnMission"].index(str(soldier_to_remove))
                # Replace the soldier
                mission["soldiersOnMission"][index_to_replace] = str(soldier_to_add)
                print(f"Soldier {soldier_to_remove} replaced by {soldier_to_add} in mission {missionID}")
            except ValueError:
                print(f"Soldier {soldier_to_remove} not found in mission {missionID}")
            break
    
    # Return the updated missions as a JSON string (if you need to save it back to a file or further process)
    return json.dumps(missions, indent=4)
    

if __name__ == "__main__":
        # Read the soldiers file content
    with open('C:/Users/adler/OneDrive - Shenkar College/SCHOOL/Year3SM1/שיטות בהנדסת תוכנה/Tactease/algorithm/temp-schedule.json', 'r') as file:
        schedule_json_str = file.read()
        updated_schedule_json_str = update_mission_schedule(schedule_json_str, 2, '1234567', '1233215')

        missions = json.loads(schedule_json_str)
        # print(updated_schedule_json_str)
        soldier_mission_hours = calculate_solder_mission_hours(missions)
        
        newMission = {
        "missionId": 21,
        "missionType": "GUARD",
        "startDate": "12/02/2024 14:00",
        "endDate": "12/02/2024 20:00",
        "soldierCount": 2,
        "soldiersOnMission": []
        }
        
        specific_day = datetime(2024, 2, 12).date()  # The day to check
        result = find_min_hours_soldier_for_day(soldier_mission_hours, specific_day)
    
        if result:
            print(f"Soldiers with minimum hours on {specific_day} are: {result[0]} , {result[1]} , {result[2]}")
        else:
            print(f"No mission data available for {specific_day}")

    newMission = {"startDate": "12/02/2024 11:00", "endDate": "12/02/2024 14:00"}

    available_soldiers = find_available_soldiers(missions, newMission)
    print("Available soldiers:", available_soldiers)

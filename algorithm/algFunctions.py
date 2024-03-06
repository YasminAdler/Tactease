from datetime import datetime
import json

def parse_datetime(date_str):
    return datetime.strptime(date_str, '%d/%m/%Y %H:%M')


def calculate_duration(start, end):
    fmt = '%d/%m/%Y %H:%M'
    start_dt = datetime.strptime(start, fmt)
    end_dt = datetime.strptime(end, fmt)
    return (end_dt - start_dt).total_seconds() / 3600


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

def find_available_soldiers(schedule, newMission):
    new_mission_start = parse_datetime(newMission["startDate"])
    new_mission_end = parse_datetime(newMission["endDate"])
    available_soldiers = set()  # Use a set to avoid duplicates

    # Assuming we have a way to iterate all soldiers (you'll need to adjust this part)
    all_soldiers = set(soldier for mission in schedule for soldier in mission["soldiersOnMission"])

    for soldier in all_soldiers:
        soldier_is_available = True
        for mission in schedule:
            if soldier in mission["soldiersOnMission"]:
                mission_start = parse_datetime(mission["startDate"])
                mission_end = parse_datetime(mission["endDate"])
                # Check if the new mission overlaps with this soldier's current missions
                if not (new_mission_end <= mission_start or new_mission_start >= mission_end):
                    soldier_is_available = False
                    break  # No need to check other missions if one conflict is found
        if soldier_is_available:
            available_soldiers.add(soldier)

    return list(available_soldiers)  # Convert the set to a list for the final result

# Example usage
schedule = [
    {"missionId": 1, "startDate": "12/02/2024 6:00", "endDate": "12/02/2024 10:00", "soldiersOnMission": ["5555555", "1232323"]},
    # Add more missions as needed
]
newMission = {"startDate": "12/02/2024 11:00", "endDate": "12/02/2024 14:00"}

available_soldiers = find_available_soldiers(schedule, newMission)
print("Available soldiers:", available_soldiers)


def find_min_hours_soldiers_for_day(soldier_mission_hours, specific_day):
    # Collect all soldiers and their hours for the specific day
    soldiers_hours = []
    for soldier, days in soldier_mission_hours.items():
        if specific_day in days:
            soldiers_hours.append((soldier, days[specific_day]))
    
    # Sort the list by hours in ascending order
    soldiers_hours.sort(key=lambda x: x[1])
    
    # Return the top 3 soldiers with the minimum hours, or all if less than 3
    return soldiers_hours[:3]

if __name__ == "__main__":
    # Assuming the rest of your setup remains the same...
    with open('C:/Users/adler/OneDrive - Shenkar College/SCHOOL/Year3SM1/שיטות בהנדסת תוכנה/Tactease/algorithm/temp-schedule.json', 'r') as file:
        schedule_json_str = file.read()
        
    updated_schedule_json_str = update_mission_schedule(schedule_json_str, 1, '1234567', '5555555')
    
    # print(updated_schedule_json_str)
        
    missions = json.loads(schedule_json_str)
    soldier_mission_hours = calculate_solder_mission_hours(missions)
    
    specific_day = datetime(2024, 2, 12).date()  # Specify the day to check
    results = find_min_hours_soldiers_for_day(soldier_mission_hours, specific_day)
    
    if results:
        for i, (soldier, hours) in enumerate(results, start=1):
            print(f"{i}. Soldier {soldier} with {hours} hours on {specific_day}")
    else:
        print(f"No mission data available for {specific_day}")

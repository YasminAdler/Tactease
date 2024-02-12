from datetime import datetime
from enum import Enum    
    
class MissionType(Enum):
    PATROL_BY_FOOT = 1
    PATROL_BY_CAR = 2
    GUARD = 3
    WATCH = 4
    OPERATION = 5

class Mission:
    missionId_counter = 1  # Class variable to auto-increment missionId

    def __init__(self, missionType, start_date, end_date, soldiers=[]):
        self.missionId = Mission.missionId_counter
        self.missionType = missionType
        self.start_date = datetime.strptime(start_date, "%Y-%m-%d")
        self.end_date = datetime.strptime(end_date, "%Y-%m-%d")
        self.soldiersCount = len(soldiers)
        self.soldiersOnMission = soldiers

        Mission.missionId_counter += 1  # Increment the ID for the next mission

    def createMission(self, missionType, start_date, end_date, soldiers):
        # This might be redundant as the init method already creates a mission
        return Mission(missionType, start_date, end_date, soldiers)

    def getMissionId(self):
        return self.missionId

    def getMissionType(self):
        return self.missionType

    def getMissionHourLength(self):
        return (self.end_date - self.start_date).total_seconds() / 3600

    def getSoldierOnMission(self):
        return self.soldiersOnMission

    def updateSoldiers(self, updatedsoldiersOnMission):
        self.soldiersOnMission = updatedsoldiersOnMission
        self.soldiersCount = len(updatedsoldiersOnMission)

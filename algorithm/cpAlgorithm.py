from ortools.linear_solver import pywraplp

import json

# Path to your JSON file
file_path = 'temp-missions.json'

# Reading the JSON file
with open(file_path, 'r') as file:
    data = json.load(file)

from enum import Enum
from mission import Mission
from soldier import Soldier
from request import Request
from schedule import Schedule

missions = data['missions']


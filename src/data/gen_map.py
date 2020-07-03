import json

# This file just reads the champions.json file and outputs a champions_map.json file
#   that has the mapping champion_key: champion_name
# This was done to reduce processing on the front end

with open("src/data/champions.json") as f:
    data = json.loads(f.read())
    new_data = {}
    for key in data["data"]:
        new_data[data["data"][key]["key"]] = key
    
    with open("src/data/champions_map.json", "a+") as out:
        out.write(json.dumps(new_data))

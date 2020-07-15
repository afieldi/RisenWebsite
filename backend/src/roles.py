import roleml
import sys
import json

data = sys.stdin.readlines()
match = json.loads(data[0])
timeline = json.loads(data[1])
results = roleml.predict(match, timeline)
for i in results:
    if results[i] == "top":
        results[i] = "TOP"
    elif results[i] == "jungle":
        results[i] = "JUNGLE"
    elif results[i] == "mid":
        results[i] = "MIDDLE"
    elif results[i] == "bot":
        results[i] = "BOTTOM"
    elif results[i] == "supp":
        results[i] = "SUPPORT"

print(json.dumps(results))

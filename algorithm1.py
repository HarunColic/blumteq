
def find_next_entry(existing_list):
    ids = {entry["id"] for entry in existing_list}
    values = [entry["value"] for entry in existing_list]

    from collections import Counter
    value_counts = Counter(values)

    smallest_missing = 1
    while smallest_missing in values:
        smallest_missing += 1

    valid_value = None
    for candidate in range(smallest_missing, max(values) + 2):
        if candidate not in values:
            smaller_values = [k for k, v in value_counts.items() if k < candidate and v >= 2]
            if smaller_values:
                valid_value = candidate
                break

    new_id = max(ids) + 1 if ids else 1

    return {"id": new_id, "value": valid_value}


a = [
    {"id": 1, "value": 3},
    {"id": 2, "value": 7},
    {"id": 3, "value": 3},
    {"id": 4, "value": 1},
    {"id": 5, "value": 9},
    {"id": 6, "value": 8},
    {"id": 7, "value": 6},
    {"id": 8, "value": 4},
    {"id": 9, "value": 4},
]

new_entry = find_next_entry(a)
print(new_entry)


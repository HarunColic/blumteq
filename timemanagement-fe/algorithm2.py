
def lookup(obj, path):
    try:
        keys = path.split(".")
        for key in keys:
            if not isinstance(obj, dict):
                print('Object not instance of dictionary')
                return None
            obj = obj.get(key)
            if obj is None:
                print('Object not found')
                return None
        return obj
    except Exception as e:
        print(f"Error: {e}")
        return None



#Example
object_data = {
    "property1": {
        "property1-1": "Apple",
        "property1-2": "Orange"
    },
    "property2": {
        "property2-1": "Banana",
        "property2-2": "Pineapple",
    }
}
path = "property2.property2-2"
result = lookup(object_data, path) # Pineapple
print(result)

path1 = "property1.property2"
print(lookup(object_data, path1))  # "Apple"

# Invalid path
path2 = "property1.property4"
print(lookup(object_data, path2))  # None

# Invalid structure in path
path3 = "property1.property2"
print(lookup('', path3))  # None

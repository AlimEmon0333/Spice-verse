import pymongo  ## pylint: disable=import-error
url = "mongodb+srv://user:user@recipesharingapp.cawng.mongodb.net/"
client = pymongo.MongoClient(url)
db = client["recipesharingapp"]

import uuid
from  tinydb import TinyDB, Query
from dotenv import load_dotenv
import os

load_dotenv()

db_name = os.getenv("TinyDBSource")
table_name = os.getenv("TABLE")

def insertUser(username, password):
    db = TinyDB(db_name)
    table = db.table(table_name)
    table.insert({'username': username, 'password': password})

def getUserInfo(username):
    db = TinyDB(db_name)
    table = db.table(table_name)
    User = Query()
    result = table.search(User.username == username)
    return result

def setKey(username):
    db = TinyDB(db_name)
    table = db.table('authKeys')
    key = str(uuid.uuid4())
    # delete previous key
    table.remove(Query().username == username)
    table.insert({'username': username, 'key': key})
    return key

def checkKey(key):
    db = TinyDB(db_name)
    table = db.table('authKeys')
    Key = Query()
    result = table.search(Key.key == key)
    return result

def deleteKey(username):
    db = TinyDB(db_name)
    table = db.table('authKeys')
    table.remove(Query().username == username)
    return True
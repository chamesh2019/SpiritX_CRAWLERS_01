from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from tinydb_Handler import checkKey, deleteKey, insertUser, getUserInfo, setKey
import json
import os
import uuid

load_dotenv()
app = Flask(__name__, static_folder='dist', template_folder='dist')


if os.getenv("ENV") == "dev":
    app.config['DEBUG'] = True
    app.config['ENV'] = 'development'

if os.getenv("Use") == "TinyBD":
    GetUser = getUserInfo
    InsertUser = insertUser

elif os.getenv("Use") == "sql":
    GetUser = getUserInfo
    InsertUser = insertUser


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path != "" and "assets" in path:
        return app.send_static_file(path)
    return render_template("index.html")


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        result = getUserInfo(username)
        print(type(result))

        if not result:
            response = {
                "status": "error",
                "message": "Invalid Username or Password"
            }

        else:
            if result[0]['password'] == password:
                response = {
                    "status": "success",
                    "message": "Logged in successfully",
                    "token" : setKey(username)
                }
            
    except Exception as e:
        response = {
            "status": "error",
            "message": "Something went wrong",
            "error": str(e)
        }
    print(response)

    return response

@app.route('/checkkey', methods=['POST'])
def checkkey():
    try:
        data = request.get_json()
        key = data.get('token')

        print(key)
        if checkKey(key):
            response = {
                "status": "success",
                "valid": True,
                "message": "Key is valid",
                "username": checkKey(key)[0]['username']
            }
        else:
            response = {
                "status": "error",
                "message": "Key is invalid"
            }

    except Exception as e:
        response = {
            "status": "error",
            "message": "Something went wrong",
            "error": str(e)
        }

    return response

@app.route('/logout', methods=['POST'])
def logout():
    try:
        data = request.get_json()
        username = data.get('username')
        key = data.get('key')

        if checkKey(username, key):
            deleteKey(username)
            response = {
                "status": "success",
                "message": "Logged out successfully"
            }

    except Exception as e:
        response = {
            "status": "error",
            "message": "Something went wrong",
            "error": str(e)
        }

    return response


@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if len(username) < 6 or len(password) < 6:
            return jsonify({"status": "error", "message": "Username and Password must be at least 6 characters long"})
        
        if getUserInfo(username):
            return jsonify({"status": "error", "message": "Username already exists"})
        InsertUser(username, password)

        return jsonify({"status": "success", "message": "Signed up successfully"})
        
            
    except Exception as e:
        response = {
            "status": "error",
            "message": "Something went wrong",
            "error": str(e)
        }

    return response


if __name__ == '__main__':
    app.run()
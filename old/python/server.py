from flask import Flask
from getData import generateOutput
import os
from os import environ 
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route("/")
def hello_world():
    return generateOutput()

if __name__ == "__main__":
    port = int(environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
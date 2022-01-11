import json

from flask import Flask, request

import holehe.core as holehe
import module

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Inspektur API'


@app.route('/check/breach', methods=['POST'])
async def check_breach():
    """
    Check breached account using email.
    """
    return 'todo'


@app.route('/check/phonenumber', methods=['POST'])
def check_username():
    """
    Check possible instagram and amazon account using phone number.
    """
    return 'todo'


@app.route('/check/email', methods=['POST'])
async def account_check():
    """
    Check possible account using email (holehe).
    """
    email = json.loads(request.data)['email']
    out = holehe.find_all(email)
    return json.dumps(out)


if __name__ == '__main__':
    app.run(debug=True)

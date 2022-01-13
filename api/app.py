import json
import os

from flask import Flask, request, jsonify

import holehe.core as holehe
import ignorant.core as ignorant
import modules.data_breach as data_breach
import modules.mobile_operator as mobile_operator
import modules.telegram as telegram
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():
    return jsonify({'status': 'success', 'message': 'Hello, inspektur!'})


@app.route('/check/breach', methods=['POST'])
async def check_breach():
    """
    Check breached account using email (cekdata).
    """
    try:
        email = json.loads(request.data)['email']
        out = data_breach.periksa_data(email)
        return jsonify(out)
    except Exception as e:
        out = {'status': 'error', 'message': str(e)}
        return jsonify(out), 400


@app.route('/check/phonenumber', methods=['POST'])
async def check_phonenumber():
    """
    Check possible instagram and snapchat account using ignorant.
    ONLY WORKS FOR INDONESIA PHONE NUMBER
    """
    try:
        number = json.loads(request.data)['number']

        # Check if phone number is valid
        if len(number) < 10:
            out = {'status': 'error', 'message': 'Invalid phone number'}
            return jsonify(out), 400

        # Get country code
        country_code = '62'

        operator = mobile_operator.check_mobile_operator(number)
        out = ignorant.find_all(number.replace('+62', ''), country_code)

        # Telegram
        telegram_info = await telegram.get_info(number)

        return ({
            'status': 'success',
            'operator': operator,
            **telegram_info,
            'data': out
        })
    except Exception as e:
        out = {'status': 'error', 'message': str(e)}
        return jsonify(out), 400


@app.route('/check/email', methods=['POST'])
async def account_check():
    """
    Check possible account using email (holehe).
    """
    try:
        email = json.loads(request.data)['email']
        out = holehe.find_all(email)
        return jsonify(out)
    except Exception as e:
        out = {'status': 'error', 'message': str(e)}
        return jsonify(out), 400


if __name__ == '__main__':
    app.config['JSON_SORT_KEYS'] = False
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.run(debug=os.environ.get('IS_DEBUG', False), host=os.environ.get('HOST'))

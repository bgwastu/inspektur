import json
import os
import re

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


@app.route('/check', methods=['POST'])
async def check():
    try:
        email = json.loads(request.data)['email']
        number = json.loads(request.data)['number']
        out = {}
        if email is not None:
            # Check email
            email_regex = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
            if not email_regex.match(email):
                out = {'status': 'error', 'message': 'Invalid email address'}
                return jsonify(out), 400

            out['email'] = holehe.find_all(email)
            out['breach'] = data_breach.periksa_data(email)

        if number is not None:
            # Check phone number
            if len(number) < 10:
                out = {'status': 'error', 'message': 'Invalid phone number'}
                return jsonify(out), 400

            operator = mobile_operator.check_mobile_operator(number)
            datas = ignorant.find_all(number.replace('+62', ''), '62')

            out['telegram'] = await telegram.get_info(number)
            out['phone_number'] = ({
                'operator': operator,
                'datas': datas
            })

        return jsonify(out), 200

    except Exception as e:
        out = {'status': 'error', 'message': str(e)}
        return jsonify(out), 400


if __name__ == '__main__':
    app.config['JSON_SORT_KEYS'] = False
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.run(debug=os.environ.get('IS_DEBUG', False), host=os.environ.get('HOST'))

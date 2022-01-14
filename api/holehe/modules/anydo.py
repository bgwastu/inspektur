import random

from holehe.localuseragent import ua


async def anydo(email, client, out):
    name = "Any.do"
    domain = "any.do"
    method= "login"
    frequent_rate_limit=True

    headers = {
        'User-Agent': random.choice(ua["browsers"]["chrome"]),
        'Accept': '*/*',
        'Accept-Language': 'en,en-US;q=0.5',
        'Referer': 'https://desktop.any.do/',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Platform': '3',
        'Origin': 'https://desktop.any.do',
        'DNT': '1',
        'Connection': 'keep-alive',
        'TE': 'Trailers',
    }

    data = '{"email":"' + email + '"}'

    response = await client.post('https://sm-prod2.any.do/check_email', headers=headers, data=data)
    if response.status_code == 200:
        if response.json()["user_exists"]:
            out.append({"name": name,"domain":domain,"method":method,"frequent_rate_limit":frequent_rate_limit,
                        "rate_limit": False,
                        "exists": True,
                        "email_recovery": None,
                        "phone_number": None,
                        "others": None})
        else:
            out.append({"name": name,"domain":domain,"method":method,"frequent_rate_limit":frequent_rate_limit,
                        "rate_limit": False,
                        "exists": False,
                        "email_recovery": None,
                        "phone_number": None,
                        "others": None})
    else:
        out.append({"name": name,"domain":domain,"method":method,"frequent_rate_limit":frequent_rate_limit,
                    "rate_limit": True,
                    "exists": False,
                    "email_recovery": None,
                    "phone_number": None,
                    "others": None})

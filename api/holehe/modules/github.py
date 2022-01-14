import re


async def github(email, client, out):
    name = "GitHub"
    domain = "github.com"
    method = "register"
    frequent_rate_limit=False

    freq = await client.get("https://github.com/join")
    token_regex = re.compile(
        r'<auto-check src="/signup_check/username[\s\S]*?value="([\S]+)"[\s\S]*<auto-check src="/signup_check/email[\s\S]*?value="([\S]+)"')
    token = re.findall(token_regex, freq.text)
    data = {"value": email, "authenticity_token": token[0]}
    req = await client.post("https://github.com/signup_check/email", data=data)
    if "Your browser did something unexpected." in req.text:
        out.append({"name": name,"domain":domain,"method":method,"frequent_rate_limit":frequent_rate_limit,
                    "rate_limit": True,
                    "exists": None,
                    "email_recovery": None,
                    "phone_number": None,
                    "others": None})
    elif req.status_code == 422:
        out.append({"name": name,"domain":domain,"method":method,"frequent_rate_limit":frequent_rate_limit,
                    "rate_limit": False,
                    "exists": True,
                    "email_recovery": None,
                    "phone_number": None,
                    "others": None})
    elif req.status_code == 200:
        out.append({"name": name,"domain":domain,"method":method,"frequent_rate_limit":frequent_rate_limit,
                    "rate_limit": False,
                    "exists": False,
                    "email_recovery": None,
                    "phone_number": None,
                    "others": None})
    else:
        out.append({"name": name,"domain":domain,"method":method,"frequent_rate_limit":frequent_rate_limit,
                    "rate_limit": True,
                    "exists": None,
                    "email_recovery": None,
                    "phone_number": None,
                    "others": None})

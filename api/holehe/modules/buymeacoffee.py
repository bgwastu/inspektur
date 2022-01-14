import random
import string

from bs4 import BeautifulSoup

from holehe.localuseragent import ua


async def buymeacoffee(email, client, out):
    name = "Buy Me a Coffee"
    domain = "buymeacoffee.com"
    method = "register"
    frequent_rate_limit = True

    def get_random_string(length):
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(length))
        return result_str

    headers = {
        'User-Agent': random.choice(ua["browsers"]["chrome"]),
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://www.buymeacoffee.com',
        'DNT': '1',
        'TE': 'Trailers',
    }
    r = await client.get("https://www.buymeacoffee.com/", headers=headers)
    if r.status_code == 200:
        soup = BeautifulSoup(r.content, features="html.parser")
        csrf_token = soup.find(attrs={'name': 'bmc_csrf_token'}).get("value")
    else:
        out.append({"name": name, "domain": domain, "method": method, "frequent_rate_limit": frequent_rate_limit,
                    "rate_limit": True,
                    "exists": False,
                    "email_recovery": None,
                    "phone_number": None,
                    "others": None})
        return None

    cookies = {
        'bmccsrftoken': csrf_token,
    }
    data = {
        'email': email,
        'password': get_random_string(20),
        'bmc_csrf_token': csrf_token
    }

    r = await client.post(
        'https://www.buymeacoffee.com/auth/validate_email_and_password',
        headers=headers,
        cookies=cookies,
        data=data)
    if r.status_code == 200:
        data = r.json()
        if data["status"] == "SUCCESS":
            out.append({"name": name, "domain": domain, "method": method, "frequent_rate_limit": frequent_rate_limit,
                        "rate_limit": False,
                        "exists": False,
                        "email_recovery": None,
                        "phone_number": None,
                        "others": None})
        elif data["status"] == "FAIL" and "email" in str(data):
            out.append({"name": name, "domain": domain, "method": method, "frequent_rate_limit": frequent_rate_limit,
                        "rate_limit": False,
                        "exists": True,
                        "email_recovery": None,
                        "phone_number": None,
                        "others": None})
        else:
            out.append({"name": name, "domain": domain, "method": method, "frequent_rate_limit": frequent_rate_limit,
                        "rate_limit": True,
                        "exists": False,
                        "email_recovery": None,
                        "phone_number": None,
                        "others": None})
    else:
        out.append({"name": name, "domain": domain, "method": method, "frequent_rate_limit": frequent_rate_limit,
                    "rate_limit": True,
                    "exists": False,
                    "email_recovery": None,
                    "phone_number": None,
                    "others": None})

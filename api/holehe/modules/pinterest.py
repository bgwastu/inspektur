async def pinterest(email, client, out):
    name = "Pinterest"
    domain = "pinterest.com"
    method = "register"
    frequent_rate_limit=False

    req = await client.get(
        "https://www.pinterest.com/_ngjs/resource/EmailExistsResource/get/",
        params={
            "source_url": "/",
            "data": '{"options": {"email": "' + email + '"}, "context": {}}'})
    if 'source_field' in str(req.json()["resource_response"]["data"]) :
        out.append({"name": name,"domain":domain,"method":method,"frequent_rate_limit":frequent_rate_limit,
                    "rate_limit": True,
                    "exists": False,
                    "email_recovery": None,
                    "phone_number": None,
                    "others": None})

    elif req.json()["resource_response"]["data"]:
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

async def protonmail(email, client, out):
    #credit https://github.com/pixelbubble/ProtOSINT
    name = "Protonmail"
    domain = "protonmail.ch"
    method= "other"
    frequent_rate_limit=False

    try:
        response = await client.get('https://api.protonmail.ch/pks/lookup?op=index&search='+email)
        if "info:1:0" in response.text :
            out.append({"name": name,"domain":domain,"method":method,"frequent_rate_limit":frequent_rate_limit,
                        "rate_limit": False,
                        "exists": False,
                        "email_recovery": None,
                        "phone_number": None,
                        "others": None})
        elif "info:1:1" in response.text:
            regexPattern1 = "2048:(.*)::"#RSA 2048-bit (Older but faster)
            regexPattern2 = "4096:(.*)::"#RSA 4096-bit (Secure but slow)
            regexPattern3 = "22::(.*)::" #X25519 (Modern, fastest, secure)
            try:
                timestamp = int(re.search(regexPattern1, response.text).group(1))
            except:
                try:
                    timestamp = int(re.search(regexPattern2, response.text).group(1))
                except :
                    timestamp = int(re.search(regexPattern3, response.text).group(1))
            dtObject = datetime.fromtimestamp(timestamp)
            out.append({"name": name,"domain":domain,"method":method,"frequent_rate_limit":frequent_rate_limit,
                        "rate_limit": False,
                        "exists": True,
                        "email_recovery": None,
                        "phone_number": None,
                        "others": {"Date, time of the creation":str(dtObject)} })
        else:
            out.append({"name": name,"domain":domain,"method":method,"frequent_rate_limit":frequent_rate_limit,
                        "rate_limit": True,
                        "exists": False,
                        "email_recovery": None,
                        "phone_number": None,
                        "others": None})
    except :
        out.append({"name": name,"domain":domain,"method":method,"frequent_rate_limit":frequent_rate_limit,
                    "rate_limit": True,
                    "exists": False,
                    "email_recovery": None,
                    "phone_number": None,
                    "others": None})

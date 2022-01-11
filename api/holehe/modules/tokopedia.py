import json


async def tokopedia(email, client, out):
    name = "tokopedia"
    domain = "tokopedia.com"
    method = "login"
    frequent_rate_limit = False

    payload = json.dumps({
        "operationName": "CheckRegisterMutation",
        "variables": {
            "id": email
        },
        "query": "mutation CheckRegisterMutation($id: String!) {\n  registerCheck(id: $id) {\n    isExist\n    errors\n    status\n    uh\n    __typename\n  }\n}\n"
    })
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
        'content-type': 'application/json',
        'Origin': 'https://www.tokopedia.com',
        'Cookie': '_abck=6F84C89CE9B69DFDA1FF7CC906BC895F~-1~YAAQ919idlJZkyd+AQAALANCRwcJe0V6W3CM2eWL4TUWBY32lKv1tMmsQggLzmg647umhJJpU/CddTs9Kt3oJGaWX+tpM51YwJ1NGBcsg3LjAuYU/ABp3AbxaWEuGQzU9IwK8QFq8qKqol68EicqVUIMRqLexnSnYka5QnVSIaQCUE/epN+5O8EWnJ/+YWBbYDnTPnuT8Cq4Koi20hJu7i6SinQJTwKcypo15fRlCcG/Nr6X38YeR+wjQkSQ1J6CDIbtmYamITxr9FMSQ9oDDaWV0qOTdTi19UbyZzSQ/hBSokKlQ8t3AOWkw5X1zQ0K/0478NMju9l46nkVu2DGPV53+kfab8BC3xhOBqBc6CY91XwnoAxzBiUelX6ZE98MuOaE/w7qlJWQ3tt/sezpGw6fB87snElYlE6XBg==~-1~-1~-1; bm_sz=DF12C402C8CCCAF783A07ADFCA938B54~YAAQ919idlNZkyd+AQAALANCRw6zN56HE7pQRPdDkIwwB6eoE+BTi/kLiOe5lfx2JyhLD7yNgvG5Lv25TmcVm2ACvIML5OH7lSuEV+6L0Yhqbc8UtLdaIK7y6Opup8kqIwOW4q0T9F3OZer16Gvi5e12gw3C+mq3Io40WjOhhHsOHoAhckd19iPthP/8eVNsrqHxMwf/sT0BSk61ekTr/Fhn37RvzvHYqFQt8yT69pMdilOCh+WPEU7R5jT18GEsDtz3u35T380AiEV3iGb4SBH9NrGuUTRZX18EyritQA0U4bH1We4=~3618611~3163697'
    }

    try:
        res = await client.post('https://gql.tokopedia.com', data=payload, headers=headers)
        data = res.json()
        is_exist = data['data']['registerCheck']['isExist']
        out.append({"name": name, "domain": domain, "method": method, "frequent_rate_limit": frequent_rate_limit,
                    "rateLimit": False,
                    "exists": bool(is_exist),
                    "emailrecovery": None,
                    "phoneNumber": None,
                    "others": None})
        return None
    except BaseException:
        out.append({"name": name, "domain": domain, "method": method, "frequent_rate_limit": frequent_rate_limit,
                    "rateLimit": True,
                    "exists": False,
                    "emailrecovery": None,
                    "phoneNumber": None,
                    "others": None})
        return None

import requests
import json
import constants
import hashlib
import trio
import httpx
import time 
import importlib
import pkgutil
from bs4 import BeautifulSoup

def check_mobile_operator(phone):
    phone = phone.replace("+62", "0")
    for operator in constants.mobile_operator:
        if phone[:4] in constants.mobile_operator[operator]:
            return operator
    return "Tidak dikenal"
    
async def check_account_exists(email):
    # Import Modules
    modules = import_submodules("holehe.modules")
    websites = get_functions(modules)
    # Start time
    start_time = time.time()
    # Def the async client
    client = httpx.AsyncClient()
    # Launching the modules
    out = []
    instrument = TrioProgress(len(websites))
    trio.lowlevel.add_instrument(instrument)
    async with trio.open_nursery() as nursery:
        for website in websites:
            nursery.start_soon(launch_module, website, email, client, out)
    trio.lowlevel.remove_instrument(instrument)
    # Sort by modules names
    out = sorted(out, key=lambda i: i['name'])
    # Close the client
    await client.aclose()
    # Print the result
    print_result(out,email,start_time,websites)

def get_functions(modules,args=None):
    """Transform the modules objects to functions"""
    websites = []

    for module in modules:
        if len(module.split(".")) > 3 :
            modu = modules[module]
            site = module.split(".")[-1]
            if args !=None and args.nopasswordrecovery==True:
                if  "adobe" not in str(modu.__dict__[site]) and "mail_ru" not in str(modu.__dict__[site]) and "odnoklassniki" not in str(modu.__dict__[site]):
                    websites.append(modu.__dict__[site])
            else:
                websites.append(modu.__dict__[site])
    return websites



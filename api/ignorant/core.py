import importlib
import pkgutil

import httpx
import trio

from holehe.instruments import TrioProgress

DEBUG = False

__version__ = "1.60.3"


def import_submodules(package, recursive=True):
    """Get all the holehe submodules"""
    if isinstance(package, str):
        package = importlib.import_module(package)
    results = {}
    for _, name, is_pkg in pkgutil.walk_packages(package.__path__):
        full_name = package.__name__ + '.' + name
        results[full_name] = importlib.import_module(full_name)
        if recursive and is_pkg:
            results.update(import_submodules(full_name))
    return results


def get_functions(modules):
    """Transform the modules objects to functions"""
    websites = []

    for module in modules:
        if len(module.split(".")) > 1:
            modu = modules[module]
            site = module.split(".")[-1]
            websites.append(modu.__dict__[site])
    return websites


async def launch_module(module, phone, country_code, client, out):
    data = {'instagram': 'instagram.com', 'snapchat': 'snapchat.com'}
    try:
        await module(phone, country_code, client, out)
    except:
        name = str(module).split('<function ')[1].split(' ')[0]
        out.append({"name": name, "domain": data[name],
                    "rateLimit": True,
                    "exists": False})


async def maincore(phone, country_code):
    # Import Modules
    modules = import_submodules("ignorant.modules")
    websites = get_functions(modules)

    # Def the async client
    client = httpx.AsyncClient()

    # Launching the modules
    out = []
    instrument = TrioProgress(len(websites))
    trio.lowlevel.add_instrument(instrument)
    async with trio.open_nursery() as nursery:
        for website in websites:
            nursery.start_soon(launch_module, website, phone, country_code, client, out)
    trio.lowlevel.remove_instrument(instrument)

    # Sort by modules names
    out = sorted(out, key=lambda i: i['name'])

    # Filter exists
    out = [i for i in out if i['exists'] is True]

    # Close the client
    await client.aclose()

    return out


def find_all(phone, country_code):
    """
        Find all the possible accounts
    """
    data = trio.run(maincore, phone, country_code)
    return data

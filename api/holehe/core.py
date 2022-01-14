import importlib
import pkgutil

import httpx
import trio


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


async def launch_module(module, email, client, out):
    data = {'aboutme': 'about.me', 'adobe': 'adobe.com', 'amazon': 'amazon.com', 'anydo': 'any.do',
            'archive': 'archive.org', 'armurerieauxerre': 'armurerie-auxerre.com', 'bodybuilding': 'bodybuilding.com',
            'buymeacoffee': 'buymeacoffee.com', 'cambridgemt': 'discussion.cambridge-mt.com',
            'caringbridge': 'caringbridge.org', 'chinaphonearena': 'chinaphonearena.com',
            'clashfarmer': 'clashfarmer.com', 'codecademy': 'codecademy.com', 'codeigniter': 'forum.codeigniter.com',
            'codepen': 'codepen.io', 'coroflot': 'coroflot.com', 'cpaelites': 'cpaelites.com', 'cpahero': 'cpahero.com',
            'cracked_to': 'cracked.to', 'crevado': 'crevado.com', 'deliveroo': 'deliveroo.com',
            'demonforums': 'demonforums.net', 'devrant': 'devrant.com', 'diigo': 'diigo.com', 'discord': 'discord.com',
            'docker': 'docker.com', 'dominosfr': 'dominos.fr', 'ebay': 'ebay.com', 'ello': 'ello.co',
            'envato': 'envato.com', 'eventbrite': 'eventbrite.com', 'evernote': 'evernote.com', 'fanpop': 'fanpop.com',
            'firefox': 'firefox.com', 'flickr': 'flickr.com', 'freelancer': 'freelancer.com',
            'freiberg': 'drachenhort.user.stunet.tu-freiberg.de', 'garmin': 'garmin.com', 'github': 'github.com',
            'google': 'google.com', 'gravatar': 'gravatar.com', 'imgur': 'imgur.com', 'instagram': 'instagram.com',
            'issuu': 'issuu.com', 'koditv': 'forum.kodi.tv', 'komoot': 'komoot.com', 'laposte': 'laposte.fr',
            'lastfm': 'last.fm', 'lastpass': 'lastpass.com', 'mail_ru': 'mail.ru', 'mybb': 'community.mybb.com',
            'myspace': 'myspace.com', 'nattyornot': 'nattyornotforum.nattyornot.com', 'naturabuy': 'naturabuy.fr',
            'ndemiccreations': 'forum.ndemiccreations.com',
            'nextpvr': 'forums.nextpvr.com', 'nike': 'nike.com', 'odampublishing': 'forum.odampublishing.com',
            'odnoklassniki': 'ok.ru', 'office365': 'office365.com', 'onlinesequencer': 'onlinesequencer.net',
            'parler': 'parler.com', 'patreon': 'patreon.com', 'pinterest': 'pinterest.com', 'plurk': 'plurk.com',
            'pornhub': 'pornhub.com', 'protonmail': 'protonmail.ch', 'quora': 'quora.com',
            'raidforums': 'raidforums.com', 'rambler': 'rambler.ru', 'redtube': 'redtube.com', 'replit': 'replit.com',
            'rocketreach': 'rocketreach.co', 'samsung': 'samsung.com', 'seoclerks': 'seoclerks.com',
            'sevencups': '7cups.com', 'smule': 'smule.com', 'snapchat': 'snapchat.com', 'soundcloud': 'soundcloud.com',
            'sporcle': 'sporcle.com', 'spotify': 'spotify.com', 'strava': 'strava.com', 'taringa': 'taringa.net',
            'teamtreehouse': 'teamtreehouse.com', 'tellonym': 'tellonym.me', 'thecardboard': 'thecardboard.org',
            'therianguide': 'forums.therian-guide.com', 'thevapingforum': 'thevapingforum.com',
            'treasureclassifieds': 'forum.treasureclassifieds.com', 'tumblr': 'tumblr.com', 'tunefind': 'tunefind.com',
            'twitter': 'twitter.com', 'venmo': 'venmo.com', 'vivino': 'vivino.com', 'voxmedia': 'voxmedia.com',
            'vrbo': 'vrbo.com', 'vsco': 'vsco.co', 'wattpad': 'wattpad.com', 'wordpress': 'wordpress.com',
            'xing': 'xing.com', 'xnxx': 'xnxx.com', 'xvideos': 'xvideos.com', 'yahoo': 'yahoo.com',
            'hubspot': 'hubspot.com', 'pipedrive': 'pipedrive.com', 'insightly': 'insightly.com',
            'nutshell': 'nutshell.com', 'zoho': 'zoho.com', 'axonaut': 'axonaut.com', 'amocrm': 'amocrm.com',
            'nimble': 'nimble.com', 'nocrm': 'nocrm.io', 'teamleader': 'teamleader.eu', 'tokopedia': 'tokopedia.com'}
    try:
        await module(email, client, out)
    except:
        name = str(module).split('<function ')[1].split(' ')[0]
        out.append({"name": name, "domain": data[name],
                    "rate_limit": True,
                    "exists": False,
                    "email_recovery": None,
                    "phone_number": None,
                    "others": None})


async def maincore(email):
    # Import Modules
    modules = import_submodules("holehe.modules")
    websites = get_functions(modules)

    # Def the async client
    client = httpx.AsyncClient()

    # Launching the modules
    out = []
    async with trio.open_nursery() as nursery:
        for website in websites:
            nursery.start_soon(launch_module, website, email, client, out)

    # Sort by modules names
    out = sorted(out, key=lambda i: i['name'])

    # Filter the results
    out = [i for i in out if i['exists'] is True]

    # Close the client
    await client.aclose()

    return out


def find_all(email):
    """
        Find all the possible accounts
    """
    data = trio.run(maincore, email)
    return data

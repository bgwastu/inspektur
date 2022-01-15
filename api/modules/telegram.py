import os
from urllib import request

from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.errors import FloodWaitError
from telethon.tl.functions.contacts import ImportContactsRequest, DeleteContactsRequest
from telethon.tl.types import InputPhoneContact

load_dotenv()

TELEGRAM_API_ID = int(os.environ.get('TELEGRAM_API_ID'))
TELEGRAM_API_HASH = os.environ.get('TELEGRAM_API_HASH')
TELEGRAM_SESSION_URL = os.environ.get('TELEGRAM_SESSION_URL')


async def get_telegram_client() -> TelegramClient:
    file_name, _ = request.urlretrieve(TELEGRAM_SESSION_URL, 'login.session')
    return TelegramClient(
        os.path.abspath(file_name),
        api_id=TELEGRAM_API_ID,
        api_hash=TELEGRAM_API_HASH
    )


async def get_info(phone_number):
    client = await get_telegram_client()
    await client.connect()

    async with client:
        try:
            contact = InputPhoneContact(client_id=0, phone=phone_number, first_name='', last_name='')
            contacts = await client(ImportContactsRequest([contact]))
            data = contacts.to_dict()['users'][0]

            user = contacts.users[0]

            last_seen = None
            if hasattr(user.status, 'was_online'):
                last_seen = data['status']['was_online'].isoformat()

            data = {
                'id': data['id'],
                'status': data['status']['_'],
                'username': data['username'],
                'last_online': last_seen,
            }

            await client(DeleteContactsRequest(id=[contacts.users[0]]))
            return data
        except IndexError:
            return None
        except TypeError:
            return None

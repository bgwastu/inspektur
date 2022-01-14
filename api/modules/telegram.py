import os

from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.tl.functions.contacts import ImportContactsRequest, DeleteContactsRequest
from telethon.tl.types import InputPhoneContact

load_dotenv()

TELEGRAM_API_ID = int(os.environ.get('TELEGRAM_API_ID'))
TELEGRAM_API_HASH = os.environ.get('TELEGRAM_API_HASH')
TELEGRAM_PHONE_NUMBER = os.environ.get('TELEGRAM_PHONE_NUMBER')


async def get_info(phone_number):
    async with TelegramClient(TELEGRAM_PHONE_NUMBER, TELEGRAM_API_ID, TELEGRAM_API_HASH) as client:
        await client.connect()
        if not await client.is_user_authorized():
            await client.send_code_request(TELEGRAM_PHONE_NUMBER)
            await client.sign_in(TELEGRAM_PHONE_NUMBER, input('Enter the code (sent on telegram): '))

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

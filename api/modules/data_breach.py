import bs4
import requests


def periksa_data(email):
    """
    Check data breach from periksadata.com
    :param email
    :return: dict
    """

    url = 'https://periksadata.com/'
    payload = {
        'email': email,
    }
    response = requests.post(url, data=payload, verify=False)
    soup = bs4.BeautifulSoup(response.text, 'html.parser')

    info = soup.select_one('.text-center.col-md-6.col-lg-5 > div > h2')
    if info is not None:
        if info.text == 'WAH SELAMAT!':
            return {'breached': False, 'data': []}

    # Get data
    breaches = []
    list = soup.select('div.col-md-6')
    for data in list:
        title = data.select_one('div.feature__body > h5').text
        date = data.select_one('div.feature__body > p > b').text
        breached_data = data.select('div.feature__body > p > b')[1].text
        total_breach = data.select('div.feature__body > p > b')[2].text

        breaches.append({
            'title': title,
            'date': date,
            'breached_data': breached_data,
            'total_breach': total_breach
        })

    return breaches

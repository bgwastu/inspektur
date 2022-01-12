import constants


def check_mobile_operator(phone):
    number = phone.replace('+62', '0', 1)
    for operator in constants.mobile_operator:
        if number[:4] in constants.mobile_operator[operator]:
            return operator
    return 'Tidak dikenal'

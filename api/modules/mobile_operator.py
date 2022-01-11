import constants


def check_mobile_operator(phone):
    phone = phone.replace("+62", "0")
    for operator in constants.mobile_operator:
        if phone[:4] in constants.mobile_operator[operator]:
            return operator
    return "Tidak dikenal"

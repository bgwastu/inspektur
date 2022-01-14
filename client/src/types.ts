export interface Payload {
    email: string | null;
    phone: string | null;
}

export interface Telegram {
    id: number;
    status: TelegramStatus;
    username: string;
    last_online: Date;
}

export interface SocialMedia {
    name: string;
    domain: string;
    method: string;
    frequent_rate_limit: string;
    rate_limit: boolean;
    exists: boolean;
    email_recovery: null;
    phone_number: null;
    others: null;
}

export interface PhoneNumber {
    operator: string;
    datas: SocialMedia[];
}

export interface Breach {
    img: string;
    title: string;
    date: string;
    breached_data: string;
    total_breach: string;
}

export interface ResponseData {
    email: SocialMedia[],
    phone_number: PhoneNumber,
    breach: Breach[],
    telegram: Telegram,
}

enum TelegramStatus {
    EMPTY = 'UserStatusEmpty',
    ONLINE = 'UserStatusOnline',
    OFFLINE = 'UserStatusOffline',
    LAST_WEEK = 'UserStatusLastWeek',
    LAST_MONTH = 'UserStatusLastMonth',
    RECENTLY = 'UserStatusRecently',
}
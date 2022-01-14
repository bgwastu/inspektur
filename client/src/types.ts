export interface Payload {
    email: string | null;
    phone: string | null;
}

export interface Telegram {
    id: number;
    status: string;
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
}

export interface PhoneNumber {
    operator: string;
    data: SocialMedia[];
}

export interface Breach {
    title: string;
    date: string;
    breached_data: string;
    total_breach: string;
}

export interface ResponseData {
    email: SocialMedia[],
    phone_number: PhoneNumber,
    breaches: Breach[],
    telegram: Telegram,
}
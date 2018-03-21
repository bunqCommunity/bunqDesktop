export type Balance = {
    value: string;
    currency: "EUR";
};

export type Avatar = {
    uuid: string;
    anchor_uuid: string;
    image: Image[];
};

export type Image = {
    attachment_public_uuid: string;
    content_type: "image/jpeg" | "image/png";
    height: number;
    width: number;
};

export type Alias = {
    type: "EMAIL" | "PHONE_NUMBER" | "IBAN";
    value: string;
    name: string;
};

export type ExtendedAlias = Alias & {
    public_nick_name: string;
    display_name: string;
    country: string;
};

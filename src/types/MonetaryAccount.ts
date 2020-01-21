import NotificationFilter from "@bunq-community/bunq-js-client/dist/Types/NotificationFilter";
import { AccountType, Alias, AllCoOwner, Amount, Avatar, Balance, MonetaryAccountSetting } from "~types/Types";

export interface IMonetaryAccount {
    // account type of this monetary account
    accountType: AccountType;

    // common fields
    id: number;
    created: Date;
    updated: Date;
    avatar: Avatar;
    currency: "EUR";
    description: string;
    daily_limit: Amount;
    daily_spent: Amount;
    overdraft_limit: Amount;
    balance: Balance;
    alias: Alias[];
    public_uuid: string;
    status: "ACTIVE" | "BLOCKED" | "CANCELLED" | "PENDING_REOPEN";
    sub_status: string;
    user_id: number;
    monetary_account_profile: any;
    notification_filters: NotificationFilter[];
    setting: MonetaryAccountSetting;

    savings_goal: Amount;
    savings_goal_progress: string;

    // only available on MonetaryAccountJoint objects
    all_co_owner: AllCoOwner | undefined;
}

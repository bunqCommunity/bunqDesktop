import MonetaryAccount from "./MonetaryAccount";
import { generateGUID } from "../Functions/Utils";
import { calculateTotalBalance } from "../Components/SavingsGoals/Helpers.js";

export type SavingsGoalSettings = {
    startAmount?: number;
};
export type SavingsGoalStatistics =
    | false
    | {
          accountsTotalFunds?: number;
          startAmount?: number;
          savedAmount?: number;
          goalAmount?: number;
          percentage?: number;
      };

export default class SavingsGoal {
    private _id: string | false = false;
    private _started: Date;
    private _expires: Date | false = false;
    private _ended: Date | false = false;
    private _title: string = "My goal!";
    private _description: string = "";
    private _account_ids: number[] = [];
    private _goal_amount: number;
    private _start_amount: number = 0;
    private _color: string = "#375cd7";
    private _settings: SavingsGoalSettings = {};
    private _statistics: SavingsGoalStatistics = false;

    private _rawData: any;

    constructor(savingsGoalObject: any | undefined) {
        if (!savingsGoalObject) return this;

        this._rawData = savingsGoalObject;

        // go through all keys and set the data
        Object.keys(savingsGoalObject).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = savingsGoalObject[key];
        });

        this._started = this._started ? new Date(this._started) : new Date();
        this._expires = this._expires ? new Date(this._expires) : false;
        this._ended = this._ended ? new Date(this._ended) : false;
        this._title = this._title && this._title.length > 0 ? this._title : "No title";
    }

    public toJSON(): any {
        return {
            id: this._id,
            started: this._started,
            expires: this._expires,
            ended: this._ended,
            title: this._title,
            description: this._description,
            account_ids: this._account_ids,
            goal_amount: this._goal_amount,
            start_amount: this._start_amount,
            color: this._color,
            settings: this._settings
        };
    }

    /**
     * Gets an item from the settings
     * @param {string} key
     * @returns {any}
     */
    public getSetting(key: string): any {
        return this._settings[key] || false;
    }

    /**
     * Ensures an ID exists and is set
     */
    public ensureId() {
        if (!this.id) {
            this._id = generateGUID();
        }
    }

    /**
     * Gets statistics based
     * @param accounts
     */
    public getStatistics(accounts: any[], shareInviteMonetaryAccountResponses: any[] = []): SavingsGoalStatistics {
        const accountsTotalFunds = calculateTotalBalance(
            accounts,
            this._account_ids,
            shareInviteMonetaryAccountResponses
        );

        const startValue = this.startAmount || 0;
        const goalAmount = this.goalAmount || 0;
        const savedAmount = accountsTotalFunds > startValue ? accountsTotalFunds - startValue : 0;
        const normalise = value => {
            if (value > goalAmount) return 100;
            if (value < startValue) return 0;
            return ((value - startValue) * 100) / (goalAmount - startValue);
        };
        const percentage = normalise(accountsTotalFunds);

        this._statistics = {
            accountsTotalFunds: accountsTotalFunds,
            startAmount: startValue,
            savedAmount: savedAmount,
            goalAmount: goalAmount,
            percentage: percentage
        };

        return this._statistics;
    }

    /**
     * Get a statistic and updates statistics if possible
     * @param {string} key
     * @param {MonetaryAccount[]} accounts
     * @param {any[]} shareInviteMonetaryAccountResponses
     * @returns {any}
     */
    public getStatistic(
        key: string,
        accounts: MonetaryAccount[] = [],
        shareInviteMonetaryAccountResponses: any[] = []
    ): any {
        if (this._statistics === false && accounts.length > 0) {
            this.getStatistics(accounts, shareInviteMonetaryAccountResponses);
        }

        if (this._statistics !== false) {
            return this._statistics[key] || false;
        }

        return false;
    }

    /**
     * Date checkers for expired, ended and started properties
     */
    get isExpired(): boolean {
        return this._expires && this._expires < new Date();
    }
    get isEnded(): boolean {
        return this._ended !== false;
    }
    get isStarted(): boolean {
        return this._started && this._started < new Date();
    }

    public setEnded(isEnded = true) {
        this._ended = isEnded ? new Date() : false;
    }

    get id(): string | false {
        return this._id;
    }
    get started(): Date {
        return this._started;
    }
    get expires(): Date | false {
        return this._expires;
    }
    get ended(): Date | false {
        return this._ended;
    }
    get title(): string {
        return this._title;
    }
    get description(): string {
        return this._description;
    }
    get accountIds(): number[] {
        return this._account_ids;
    }
    get goalAmount(): number {
        return this._goal_amount;
    }
    get startAmount(): number {
        return this._start_amount;
    }
    get color(): string {
        return this._color;
    }
    get settings(): SavingsGoalSettings {
        return this._settings;
    }
}

import { generateGUID } from "../Helpers/Utils";

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
    private _expires: Date | false;
    private _ended: Date | false;
    private _title: string = "";
    private _description: string = "";
    private _accountIds: number[];
    private _goalAmount: number;
    private _color: number;
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
    }

    public toJSON(): any {
        return {
            id: this._id,
            started: this._started,
            expires: this._expires,
            ended: this._ended,
            title: this._title,
            description: this._description,
            accountIds: this._accountIds,
            goal_amount: this._goalAmount,
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
        return this._settings[key];
    }

    /**
     * Gets an item from the settings
     * @param {string} key
     * @returns {any}
     */
    public getStatistic(key: string): any {
        if (this._statistics !== false) {
            return this._statistics[key];
        }

        return false;
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
    public getStatistics(accounts: any[], forceUpdate: boolean = false): SavingsGoalStatistics {
        if (forceUpdate && this._statistics !== false) {
            return this._statistics;
        }

        const accountsTotalFunds = accounts.reduce((accumulator, account) => {
            if (this.accountIds.includes(account.id)) {
                return accumulator + account.getBalance();
            }
            return accumulator;
        }, 0);

        const startValue = this.getSetting("startAmount") || 0;
        const savedAmount = accountsTotalFunds > startValue ? accountsTotalFunds - startValue : 0;
        const goalAmount = this.goalAmount;
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

    public setEnded(){
        this._ended = new Date();
    }
    public setTitle(title: string) {
        this._title = title;
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
        return this._accountIds;
    }
    get goalAmount(): number {
        return this._goalAmount;
    }
    get color(): number {
        return this._color;
    }
    get settings(): SavingsGoalSettings {
        return this._settings;
    }
}

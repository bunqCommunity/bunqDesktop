import { generateGUID } from "../Helpers/Utils";

export type SavingsGoalSettings = {
    startAmount?: number;
};

export type SavingsGoalStatus = "ACTIVE" | "CANCELED" | "EXPIRED" | "COMPLETED" | "FAILED";

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
     * Ensures an ID exists and is set
     */
    public ensureId() {
        if (!this.id) {
            this._id = generateGUID();
        }
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

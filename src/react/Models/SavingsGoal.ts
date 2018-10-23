import { generateGUID } from "../Helpers/Utils";

export type SavingsGoalSettings = {
    startAmount?: number;
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

    private _rawData: any;

    constructor(savingsGoalObject: any) {
        this._rawData = savingsGoalObject;

        // go through all keys and set the data
        Object.keys(savingsGoalObject).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = savingsGoalObject[key];
        });

        this._started = new Date(this._started);
        this._expires = this._expires ? new Date(this._expires) : false;
        this._ended = this._ended ? new Date(this._ended) : false;
    }

    public toJSON(): any {
        return this._rawData;
    }

    public getSetting(key: string): any {
        return this._settings[key];
    }

    public ensureId() {
        if (!this.id) {
            this._id = generateGUID();
        }
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
    get isExpired(): boolean {
        return this._expires && this._expires < new Date();
    }
}

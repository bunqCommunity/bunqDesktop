import { formatMoney } from "./Utils";

export const integerTemplate = value => {
    return parseInt(value);
};

export const moneyTemplate = value => {
    return formatMoney(value);
};

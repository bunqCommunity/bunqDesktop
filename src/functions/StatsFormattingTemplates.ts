import { formatMoney } from "./Utils";

export const integerTemplate = value => {
    return parseInt(value);
};

export const moneyTemplate = value => {
    return formatMoney(value, true);
};

/**
 * Sorts the tooltips by putting highest values at the top
 * @param a
 * @param b
 * @param data
 * @returns {number}
 */
export const sortLinearChartTooltips = (a, b, data) => {
    const dataSetA = data.datasets[a.datasetIndex];
    const dataItemA = dataSetA.data[a.index];
    const dataSetB = data.datasets[b.datasetIndex];
    const dataItemB = dataSetB.data[b.index];

    if (dataItemA > dataItemB) return -1;
    if (dataItemA < dataItemB) return 1;
    return 0;
};

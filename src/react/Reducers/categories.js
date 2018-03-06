import store from "store";
import { generateGUID } from "../Helpers/Utils";

export const BUNQDESKTOP_CATEGORIES = "BUNQDESKTOP_CATEGORIES";
export const BUNQDESKTOP_CATEGORY_CONNECTIONS =
    "BUNQDESKTOP_CATEGORY_CONNECTIONS";

const categoriesStored = store.get(BUNQDESKTOP_CATEGORIES);
const categoryConnectionsStored = store.get(BUNQDESKTOP_CATEGORY_CONNECTIONS);

// test data for defaults
const categoriesTest = {
    randomId: {
        id: "randomId",
        label: "Custom category",
        color: "#64ffa2",
        icon: "star"
    },
    randomId2: {
        id: "randomId2",
        label: "Gifts",
        color: "#31acff",
        icon: "credit_card"
    },
    randomId3: {
        id: "randomId3",
        label: "Rent",
        color: "#ff0009",
        icon: "home"
    }
};
const categoryConnectionsTest = {
    randomId: {
        Payment: [79695, 79693],
        BunqMeTab: [159, 149]
    },
    randomId2: {
        Payment: [79695, 79693],
        BunqMeTab: [159, 149]
    },
    randomId3: {
        Payment: [79695, 79693],
        BunqMeTab: [159, 149]
    }
};

// default values if no data is stored
const categoriesStoredDefault =
    categoriesStored !== undefined ? categoriesStored : categoriesTest;
const categoryConnectionsStoredDefault =
    categoryConnectionsStored !== undefined
        ? categoryConnectionsStored
        : categoryConnectionsTest;

// construct the default state
export const defaultState = {
    categories: categoriesStoredDefault,
    category_connections: categoryConnectionsStoredDefault
};

export default function reducer(state = defaultState, action) {
    const categories = { ...state.categories };
    const category_connections = { ...state.category_connections };

    switch (action.type) {
        case "CATEGORIES_SET_CATEGORIES":
            store.set(BUNQDESKTOP_CATEGORIES, action.payload.categories);
            return {
                ...state,
                categories: action.payload.categories
            };

        case "CATEGORIES_SET_CATEGORY":
            const randomId = action.payload.id
                ? action.payload.id
                : generateGUID();

            categories[randomId] = {
                id: randomId,
                label: action.payload.label,
                color: action.payload.color,
                ...action.payload.options
            };

            store.set(BUNQDESKTOP_CATEGORIES, action.payload.categories);
            return {
                ...state,
                categories: categories
            };

        case "CATEGORIES_SET_CATEGORY_CONNECTIONS":
            store.set(
                BUNQDESKTOP_CATEGORY_CONNECTIONS,
                action.payload.category_connections
            );
            return {
                ...state,
                category_connections: action.payload.category_connections
            };

        case "CATEGORIES_SET_CATEGORY_CONNECTION":
            const categoryId = action.payload.category_id;
            const itemType = action.payload.item_type;
            const itemId = action.payload.item_id;

            if (!category_connections[categoryId]) {
                category_connections[categoryId] = {};
            }
            if (!category_connections[categoryId][itemType]) {
                category_connections[categoryId][itemType] = [];
            }

            // prevent duplicates
            if (
                category_connections[categoryId][itemType].includes(itemId) ===
                false
            ) {
                category_connections[categoryId][itemType].push(itemId);
            }

            store.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, category_connections);
            return {
                ...state,
                category_connections: category_connections
            };
    }
    return state;
}

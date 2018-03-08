import store from "store";

import {
    BUNQDESKTOP_CATEGORIES,
    BUNQDESKTOP_CATEGORY_CONNECTIONS
} from "../Reducers/categories";

export const setCategory = (label, color, priority = 5, options = {}) => {
    return {
        action: "CATEGORIES_SET_CATEGORY",
        payload: {
            label: label,
            color: color,
            priority: priority,
            options: options
        }
    };
};

export const setCategoryConnection = (categoryId, itemType, itemId) => {
    return {
        action: "CATEGORIES_SET_CATEGORY_CONNECTION",
        payload: {
            category_id: categoryId,
            item_type: itemType,
            item_id: itemId
        }
    };
};

export const setCategories = categories => {
    return {
        action: "CATEGORIES_SET_CATEGORIES",
        payload: {
            categories: categories
        }
    };
};

export const setCategoryConnections = categoryConnections => {
    return {
        action: "CATEGORIES_SET_CATEGORY_CONNECTIONS",
        payload: {
            category_connections: categoryConnections
        }
    };
};

export const loadCategories = () => {
    const categories = store.get(BUNQDESKTOP_CATEGORIES);
    return setCategories(categories);
};

export const loadCategoryConnections = () => {
    const categoryConnections = store.get(BUNQDESKTOP_CATEGORY_CONNECTIONS);
    return setCategoryConnections(categoryConnections);
};

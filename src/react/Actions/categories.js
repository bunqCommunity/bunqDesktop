export const setCategory = (id = false, label, color, icon, priority = 5, options = {}) => {
    return {
        type: "CATEGORIES_SET_CATEGORY",
        payload: {
            id: id,
            label: label,
            color: color,
            icon: icon,
            priority: priority,
            options: options
        }
    };
};

export const setCategoryConnection = (categoryId, itemType, itemId) => {
    return {
        type: "CATEGORIES_SET_CATEGORY_CONNECTION",
        payload: {
            category_id: categoryId,
            item_type: itemType,
            item_id: itemId
        }
    };
};

export const setCategoryConnectionMultiple = categoryConnections => {
    return {
        type: "CATEGORIES_SET_CATEGORY_CONNECTION_MULTIPLE",
        payload: {
            category_connections: categoryConnections
        }
    };
};

export const removeCategory = categoryId => {
    return {
        type: "CATEGORIES_REMOVE_CATEGORY",
        payload: {
            category_id: categoryId
        }
    };
};

export const removeCategoryConnection = (categoryId, itemType = false, itemId = false) => {
    return {
        type: "CATEGORIES_REMOVE_CATEGORY_CONNECTION",
        payload: {
            category_id: categoryId,
            item_type: itemType,
            item_id: itemId
        }
    };
};

export const setCategories = categories => {
    return {
        type: "CATEGORIES_SET_CATEGORIES",
        payload: {
            categories: categories
        }
    };
};

export const setCategoryConnections = categoryConnections => {
    return {
        type: "CATEGORIES_SET_CATEGORY_CONNECTIONS",
        payload: {
            category_connections: categoryConnections
        }
    };
};

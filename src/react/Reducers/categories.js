import settings from "../ImportWrappers/electronSettings";
import { generateGUID } from "../Functions/Utils";

// default categories if no previous were found
const defaultCategories = require("@bunq-community/bunqdesktop-templates/categories.json");

export const BUNQDESKTOP_CATEGORIES = "BUNQDESKTOP_CATEGORIES";
export const BUNQDESKTOP_CATEGORY_CONNECTIONS = "BUNQDESKTOP_CATEGORY_CONNECTIONS";

const categoriesStored = settings.get(BUNQDESKTOP_CATEGORIES);
const categoryConnectionsStored = settings.get(BUNQDESKTOP_CATEGORY_CONNECTIONS);

// default values if no data is stored
const categoriesStoredDefault =
    categoriesStored !== undefined ? JSON.parse(JSON.stringify(categoriesStored)) : defaultCategories;

const categoryConnectionsStoredDefault =
    categoryConnectionsStored !== undefined ? JSON.parse(JSON.stringify(categoryConnectionsStored)) : {};

// store the default categories
if (categoriesStored === undefined) settings.set(BUNQDESKTOP_CATEGORIES, defaultCategories);
if (categoryConnectionsStored === undefined) settings.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, {});

// construct the default state
export const defaultState = {
    last_update: new Date().getTime(),
    categories: categoriesStoredDefault,
    category_connections: categoryConnectionsStoredDefault
};

export default function reducer(state = defaultState, action) {
    const categories = { ...state.categories };
    const category_connections = { ...state.category_connections };

    switch (action.type) {
        case "CATEGORIES_SET_CATEGORIES":
            settings.set(BUNQDESKTOP_CATEGORIES, action.payload.categories);
            return {
                ...state,
                last_update: new Date().getTime(),
                categories: action.payload.categories
            };

        case "CATEGORIES_SET_CATEGORY":
            const randomId = action.payload.id ? action.payload.id : generateGUID();

            categories[randomId] = {
                id: randomId,
                label: action.payload.label,
                color: action.payload.color,
                icon: action.payload.icon,
                priority: action.payload.priority,
                ...action.payload.options
            };

            settings.set(BUNQDESKTOP_CATEGORIES, categories);
            return {
                ...state,
                last_update: new Date().getTime(),
                categories: categories
            };

        case "CATEGORIES_REMOVE_CATEGORY":
            const currentCategories = { ...state.categories };
            const currentCategoryConnections = {
                ...state.category_connections
            };
            const removeCategoryId = action.payload.category_id;

            // delete this category from the list
            if (currentCategories[removeCategoryId]) {
                delete currentCategories[removeCategoryId];
            }

            // delete this category from the list
            if (currentCategoryConnections[removeCategoryId]) {
                delete currentCategoryConnections[removeCategoryId];
            }

            settings.set(BUNQDESKTOP_CATEGORIES, currentCategories);
            settings.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, currentCategoryConnections);
            return {
                ...state,
                last_update: new Date().getTime(),
                categories: currentCategories,
                category_connections: currentCategoryConnections
            };

        case "CATEGORIES_REMOVE_CATEGORY_CONNECTION":
            const currentCategoryConnections2 = {
                ...state.category_connections
            };
            const categoryId = action.payload.category_id;
            const type = action.payload.item_type;
            const id = action.payload.item_id;

            if (currentCategoryConnections2[categoryId]) {
                if (!type) {
                    // remove all existing connections for this category
                    delete currentCategoryConnections2[categoryId];
                } else if (currentCategoryConnections2[categoryId][type]) {
                    if (!id) {
                        // remove all existing connections for this category > type
                        delete currentCategoryConnections2[categoryId][type];
                    } else {
                        const idIndex = currentCategoryConnections2[categoryId][type].indexOf(id);
                        // remove all existing connections for this category > type > id
                        if (idIndex > -1) {
                            currentCategoryConnections2[categoryId][type].splice(idIndex, 1);
                        }
                    }
                }
            }

            settings.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, currentCategoryConnections2);
            return {
                ...state,
                last_update: new Date().getTime(),
                category_connections: currentCategoryConnections2
            };

        case "CATEGORIES_SET_CATEGORY_CONNECTIONS":
            settings.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, action.payload.category_connections);
            return {
                ...state,
                last_update: new Date().getTime(),
                category_connections: action.payload.category_connections
            };

        case "CATEGORIES_SET_CATEGORY_CONNECTION":
            const categoryId2 = action.payload.category_id;
            const itemType = action.payload.item_type;
            const itemId = action.payload.item_id;

            if (!category_connections[categoryId2]) {
                category_connections[categoryId2] = {};
            }
            if (!category_connections[categoryId2][itemType]) {
                category_connections[categoryId2][itemType] = [];
            }

            // prevent duplicates
            if (category_connections[categoryId2][itemType].includes(itemId) === false) {
                category_connections[categoryId2][itemType].push(itemId);
            }

            settings.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, category_connections);
            return {
                ...state,
                last_update: new Date().getTime(),
                category_connections: category_connections
            };

        case "CATEGORIES_SET_CATEGORY_CONNECTION_MULTIPLE":
            const categoryConnectionMultiple = action.payload.category_connections;

            categoryConnectionMultiple.forEach(categoryConnectionItem => {
                const catId = categoryConnectionItem.category_id;
                const catType = categoryConnectionItem.event_type;
                const eventId = categoryConnectionItem.event_id;

                if (!category_connections[catId]) {
                    category_connections[catId] = {};
                }
                if (!category_connections[catId][catType]) {
                    category_connections[catId][catType] = [];
                }

                // prevent duplicates
                if (category_connections[catId][catType].includes(eventId) === false) {
                    category_connections[catId][catType].push(eventId);
                }
            });

            // update settings
            settings.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, category_connections);
            // return new state
            return {
                ...state,
                last_update: new Date().getTime(),
                category_connections: category_connections
            };

        // update categories in new settings location
        case "OPTIONS_OVERWRITE_SETTINGS_LOCATION":
            settings.set(BUNQDESKTOP_CATEGORIES, state.categories);
            settings.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, state.category_connections);
            return { ...state };

        // load categories from new settings location
        case "OPTIONS_LOAD_SETTINGS_LOCATION":
            const storedCategories = settings.get(BUNQDESKTOP_CATEGORIES);
            const storedConnections = settings.get(BUNQDESKTOP_CATEGORY_CONNECTIONS);
            return {
                ...state,
                last_update: new Date().getTime(),
                categories: storedCategories ? storedCategories : state.categories,
                category_connections: storedConnections ? storedConnections : state.category_connections
            };
    }
    return state;
}

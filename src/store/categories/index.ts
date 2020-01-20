import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import Category from "~types/Category";

import settings from "~importwrappers/electronSettings";
import { generateGUID } from "~functions/Utils";

import { BUNQDESKTOP_CATEGORIES, BUNQDESKTOP_CATEGORY_CONNECTIONS } from "~misc/consts";

import defaultCategories from "@bunq-community/bunqdesktop-templates/categories.json";

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


export interface ISetCategoryPayload {
    id: number;
    label: string;
    color: string;
    icon: number;
    priority: number;
    options?: any;
}

const setCategoryAction = createAction("setCategory");

export interface ISetCategoriesPayload {
    [id: string]: Category;
}

const setCategoriesAction = createAction("setCategories");
export type IRemoveCategoryPayload = string;
const removeCategoryAction = createAction("removeCategory");

export interface ISetCategoryConnectionPayload {
    category_id: number;
    item_type: string;
    item_id: number;
}

const setCategoryConnectionAction = createAction("setCategoryConnection");
export type ISetCategoryConnectionMultiplePayload = Array<{
    category_id: number;
    event_type: number;
    event_id: number;
}>
const setCategoryConnectionMultipleAction = createAction("setCategoryConnectionMultiple");

export interface ISetCategoryConnectionsPayload {
    [id: string]: ISetCategoryConnectionPayload;
}

const setCategoryConnectionsAction = createAction("setCategoryConnections");

export interface IRemoveCategoryConnectionPayload {
    category_id: number;
    item_type: string;
    item_id: number;
}

const removeCategoryConnectionAction = createAction("removeCategoryConnection");


export interface ICategoriesState {
    last_update: number;
    categories: {
        [id: string]: Category;
    };
    category_connections: {
        [id: string]: any;
    };
}

const initialState: ICategoriesState = {
    last_update: +new Date(),
    categories: categoriesStoredDefault,
    category_connections: categoryConnectionsStoredDefault,
};

const slice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        [setCategoriesAction.type](state, action: PayloadAction<ISetCategoriesPayload>) {
            // TODO: move to saga subscriber
            settings.set(BUNQDESKTOP_CATEGORIES, action.payload);

            state.last_update = +new Date();
            state.categories = action.payload;
        },
        [setCategoryAction.type](state, action: PayloadAction<ISetCategoryPayload>) {
            const randomId = action.payload.id ? action.payload.id : generateGUID();

            state.categories[randomId] = {
                id: randomId,
                label: action.payload.label,
                color: action.payload.color,
                icon: action.payload.icon,
                priority: action.payload.priority,
                ...(action.payload.options ?? {}),
            };

            // TODO: move to saga subscriber
            settings.set(BUNQDESKTOP_CATEGORIES, state.categories);

            state.last_update = +new Date();
        },
        [removeCategoryAction.type](state, action: PayloadAction<IRemoveCategoryPayload>) {
            const currentCategories = { ...state.categories };
            const currentCategoryConnections = {
                ...state.category_connections
            };
            const removeCategoryId = action.payload;

            // delete this category from the list
            if (currentCategories[removeCategoryId]) {
                delete currentCategories[removeCategoryId];
            }

            // delete this category from the list
            if (currentCategoryConnections[removeCategoryId]) {
                delete currentCategoryConnections[removeCategoryId];
            }

            // TODO: move to saga subscriber
            settings.set(BUNQDESKTOP_CATEGORIES, currentCategories);
            // TODO: move to saga subscriber
            settings.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, currentCategoryConnections);

            state.last_update = +new Date();
            state.categories = currentCategories;
            state.category_connections = currentCategoryConnections;
        },
        [removeCategoryConnectionAction.type](state, action: PayloadAction<IRemoveCategoryConnectionPayload>) {
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

            // TODO: move to saga subscriber
            settings.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, currentCategoryConnections2);

            state.last_update = +new Date();
            state.category_connections = currentCategoryConnections2;
        },
        [setCategoryConnectionsAction.type](state, action: PayloadAction<ISetCategoryConnectionsPayload>) {
            // TODO: move to saga subscriber
            settings.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, action.payload.category_connections);

            state.last_update = +new Date();
            state.category_connections = action.payload.category_connections;
        },
        [setCategoryConnectionAction.type](state, action: PayloadAction<ISetCategoryConnectionPayload>) {
            const category_connections = { ...state.category_connections };
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

            // TODO: move to saga subscriber
            settings.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, category_connections);

            state.last_update = +new Date();
            state.category_connections = category_connections;
        },
        [setCategoryConnectionMultipleAction.type](state, action: PayloadAction<ISetCategoryConnectionMultiplePayload>) {
            const category_connections = { ...state.category_connections };
            const categoryConnectionMultiple = action.payload;

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

            state.last_update = +new Date();
            state.category_connections = category_connections;
        },
        ["OPTIONS_OVERWRITE_SETTINGS_LOCATION"](state) {
            // TODO: move to saga subscriber
            settings.set(BUNQDESKTOP_CATEGORIES, state.categories);
            settings.set(BUNQDESKTOP_CATEGORY_CONNECTIONS, state.category_connections);
        },
        ["OPTIONS_LOAD_SETTINGS_LOCATION"](state) {
            // TODO: move to saga subscriber
            const storedCategories = settings.get(BUNQDESKTOP_CATEGORIES);
            const storedConnections = settings.get(BUNQDESKTOP_CATEGORY_CONNECTIONS);

            state.last_update = +new Date();
            state.categories = storedCategories ? storedCategories : state.categories;
            state.category_connections = storedConnections ? storedConnections : state.category_connections;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };

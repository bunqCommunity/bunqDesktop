import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
// fetch all reducers as a bundle
import reducer from "./Reducers/index.js";

// create the middleware for this store
let middleware;
if (process.env.DEBUG === true) {
    // create middleware with logger
    middleware = applyMiddleware(
        thunk,
        createLogger({
            collapsed: true,
            timestamp: false
        })
    );
} else {
    // default middleware
    middleware = applyMiddleware(thunk);
}

//return the store
export default (initialValues = {}) => {
    return createStore(reducer, initialValues, middleware);
};

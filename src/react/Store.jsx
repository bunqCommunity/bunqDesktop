import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
// fetch all reducers as a bundle
import reducer from "./Reducers/index.js";

// create the middleware for this store
let middleware;
if (process.env.DEVELOPMENT === true) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    middleware = composeEnhancers(applyMiddleware(thunk));
} else {
    // default middleware
    middleware = compose(applyMiddleware(thunk));
}

//return the store
export default (initialValues = {}) => {
    return createStore(reducer, initialValues, middleware);
};

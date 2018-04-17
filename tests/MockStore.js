import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

// create a list of middlewares
const middlewares = [thunk];

// export the mockstore function
export default configureMockStore(middlewares);

import { createShallow } from "@material-ui/core/test-utils";
import React from "react";
import enzyme from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Adapter from "enzyme-adapter-react-16";
import Store from "../src/react/Store";

// configure a react16 adapter
enzyme.configure({ adapter: new Adapter() });

const materialShallow = createShallow();

export const shallow = (Node, options = {}) => {
    const defaultOptions = {
        location: "/",
        ...options
    };

    return materialShallow(
        <Provider store={Store()}>
            <MemoryRouter initialEntries={[defaultOptions.location]}>
                <Node />
            </MemoryRouter>
        </Provider>
    );
};

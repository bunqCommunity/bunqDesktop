import { createShallow } from "material-ui/test-utils";
import React from "react";
import enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// mock the service worker files
jest.mock("electron");
jest.mock("electron-settings");

import App from "../../../src/react/App";

describe("<App />", () => {
    let shallow;

    beforeAll(() => {
        // configure a react16 adapter
        enzyme.configure({ adapter: new Adapter() });

        // allow shallwo renderer
        shallow = createShallow();
    });

    it("should render", () => {
        const wrapper = shallow(<App />);
    });
});

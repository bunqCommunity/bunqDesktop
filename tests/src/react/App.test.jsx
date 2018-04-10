import { createShallow } from 'material-ui/test-utils';
import React from "react";
import App from "../../../src/react/App";

describe('<App />', () => {
    let shallow;

    before(() => {
        shallow = createShallow();
    });

    it('should work', () => {
        const wrapper = shallow(<App />);
    });
});

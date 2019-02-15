import React from 'react';
import {shallow} from "enzyme";
import {Footer} from './Footer';

import style from './Footer.scss';

function setup() {
    const wrapper = shallow(<Footer/>);
    return {
        wrapper
    }
}

describe('Footer', () => {
    it('should render self and subcomponents', () => {
        const {wrapper} = setup();
        expect(wrapper.hasClass(style.container)).toBe(true);
        expect(wrapper).toMatchSnapshot();
    });

    it('should include 2 images', () => {
        const {wrapper} = setup();
        expect(wrapper.find('img').length).toBe(2);
    })
});

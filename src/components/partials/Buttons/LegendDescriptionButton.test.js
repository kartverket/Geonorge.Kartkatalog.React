import React from 'react';
import { shallow } from "enzyme";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LegendDescriptionButton } from './LegendDescriptionButton';
import style from 'components/partials/Buttons/Buttons.module.scss';

function setupItemWithLegendDescriptionButtonUrl() {
    const metadata = {
        Uuid: '1234',
        LegendDescriptionUrl: 'test'
    }
    const props = {
        metadata: metadata,
        getResource: jest.fn()
    }
    const wrapper = shallow(<LegendDescriptionButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemWithoutLegendDescriptionButtonUrl() {
    const metadata = {
        Uuid: '1234',
    }
    const props = {
        metadata: metadata,
        getResource: jest.fn()
    }
    const wrapper = shallow(<LegendDescriptionButton {...props} />)

    return {
        props,
        wrapper
    }
}


describe('ProductsheetButton', () => {

    it('should render self', () => {
        const { wrapper } = setupItemWithLegendDescriptionButtonUrl()
        expect(wrapper).toMatchSnapshot();
    })

    it('Item with DistributionUrl', () => {
        const { wrapper } = setupItemWithLegendDescriptionButtonUrl()

        expect(wrapper.hasClass(style.btn)).toBe(true)
        expect(wrapper.prop("href")).toBe('test')
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('image')
    })

    it('Item without DistributionUrl', () => {
        const { wrapper } = setupItemWithoutLegendDescriptionButtonUrl()

        expect(wrapper.hasClass(style.btn + '  disabled')).toBe(true)
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('image')
    })
})

import React from 'react';
import { shallow } from "enzyme";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LegendDescriptionButton } from './LegendDescriptionButton';

function setupItemWithLegendDescriptionButtonUrl() {
    const metadata = {
        Uuid: '1234',
        LegendDescriptionUrl: 'test'
    }
    const props = {
        metadata: metadata
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
        metadata: metadata
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

        expect(wrapper.hasClass('btn btn-default')).toBe(true)
        expect(wrapper.prop("href")).toBe('test')
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')        
        expect(wrapper.find("span").first().html()).toContain('Vis tegneregler')
    })

    it('Item without DistributionUrl', () => {
        const { wrapper } = setupItemWithoutLegendDescriptionButtonUrl()
        
        expect(wrapper.hasClass('btn btn-default disabled')).toBe(true)
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')        
        expect(wrapper.find("span").first().html()).toContain('Vis tegneregler')
    })
})

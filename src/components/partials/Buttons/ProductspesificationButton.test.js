import React from 'react';
import { shallow } from "enzyme";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProductspesificationButton } from './ProductspesificationButton';

function setupItemWithProductSpecificationUrl() {
    const metadata = {
        Uuid: '1234',
        ProductSpecificationUrl: 'test'
    }
    const props = {
        metadata: metadata
    }
    const wrapper = shallow(<ProductspesificationButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemWithoutProductSpecificationUrl() {
    const metadata = {
        Uuid: '1234',
    }
    const props = {
        metadata: metadata
    }
    const wrapper = shallow(<ProductspesificationButton {...props} />)

    return {
        props,
        wrapper
    }
}


describe('ProductsheetButton', () => {
    
    it('should render self', () => {
        const { wrapper } = setupItemWithProductSpecificationUrl()
        expect(wrapper).toMatchSnapshot();
    })

    it('Item with DistributionUrl', () => {
        const { wrapper } = setupItemWithProductSpecificationUrl()

        expect(wrapper.hasClass('btn btn-default')).toBe(true)
        expect(wrapper.prop("href")).toBe('test')
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')        
        expect(wrapper.find("span").first().html()).toContain('Vis produktspesifikasjon')
    })

    it('Item without DistributionUrl', () => {
        const { wrapper } = setupItemWithoutProductSpecificationUrl()
        
        expect(wrapper.hasClass('btn btn-default disabled')).toBe(true)
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')        
        expect(wrapper.find("span").first().html()).toContain('Vis produktspesifikasjon')
    })
})

import React from 'react';
import { shallow } from "enzyme";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProductPageButton } from './ProductPageButton';
import style from './Buttons.scss'

function setupItemWithProductPageUrl() {
    const metadata = {
        Uuid: '1234',
        ProductPageUrl: 'test'
    }
    const props = {
        metadata: metadata
    }
    const wrapper = shallow(<ProductPageButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemWithoutProductPageUrl() {
    const metadata = {
        Uuid: '1234',
    }
    const props = {
        metadata: metadata
    }
    const wrapper = shallow(<ProductPageButton {...props} />)

    return {
        props,
        wrapper
    }
}


describe('setupItemWithProductPageUrl', () => {
    
    it('should render self', () => {
        const { wrapper } = setupItemWithProductPageUrl()
        expect(wrapper).toMatchSnapshot();
    })

    it('Item with product page url', () => {
        const { wrapper } = setupItemWithProductPageUrl()

        expect(wrapper.hasClass(style.btn)).toBe(true)
        expect(wrapper.prop("href")).toBe('test')
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')        
        expect(wrapper.find("span").first().html()).toContain('Vis produktside')
    })

    it('Item without product page url', () => {
        const { wrapper } = setupItemWithoutProductPageUrl()
        
        expect(wrapper.hasClass(style.btn + ' disabled')).toBe(true)
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')        
        expect(wrapper.find("span").first().html()).toContain('Vis produktside')
    })
})

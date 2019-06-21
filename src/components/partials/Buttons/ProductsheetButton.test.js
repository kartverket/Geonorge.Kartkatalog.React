import React from 'react';
import { shallow } from "enzyme";
import { ProductSheetButton } from './ProductsheetButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Buttons.scss'

function setupItemWithProductsheetUrl() {
    const metadata = {
        Uuid: '1234',
        ProductSheetUrl: 'test'
    }
    const props = {
        metadata: metadata,
        getResource: jest.fn()
    }
    const wrapper = shallow(<ProductSheetButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemWithoutProductsheetUrl() {
    const metadata = {
        Uuid: '1234',
    }
    const props = {
        metadata: metadata,
        getResource: jest.fn()
    }
    const wrapper = shallow(<ProductSheetButton {...props} />)

    return {
        props,
        wrapper
    }
}


describe('ProductsheetButton', () => {
    
    it('should render self', () => {
        const { wrapper } = setupItemWithProductsheetUrl()
        expect(wrapper).toMatchSnapshot();
    })

    it('Application with DistributionUrl', () => {
        const { wrapper } = setupItemWithProductsheetUrl()

        expect(wrapper.hasClass(style.btn)).toBe(true)
        expect(wrapper.prop("href")).toBe('test')
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('info-circle')        
        expect(wrapper.find("span").first().html()).toContain('Vis produktark')
    })

    it('Application without DistributionUrl', () => {
        const { wrapper } = setupItemWithoutProductsheetUrl()
        
        expect(wrapper.hasClass(style.btn + ' disabled')).toBe(true)
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('info-circle')        
        expect(wrapper.find("span").first().html()).toContain('Vis produktark')
    })
})

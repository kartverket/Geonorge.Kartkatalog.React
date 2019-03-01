import React from 'react';
import { shallow } from "enzyme";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContactOwnerButton } from './ContactOwnerButton';
import style from './Buttons.scss'

function setupItemWithContactMetadata() {
    const metadata = {
        Uuid: '1234',
        ContactMetadata: {
            Email:'test'
        } 
    }
    const props = {
        metadata: metadata
    }
    const wrapper = shallow(<ContactOwnerButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemWithoutContactMetadata() {
    const metadata = {
        Uuid: '1234',
    }
    const props = {
        metadata: metadata
    }
    const wrapper = shallow(<ContactOwnerButton {...props} />)

    return {
        props,
        wrapper
    }
}


describe('ContactOwnerButton', () => {
    
    it('should render self', () => {
        const { wrapper } = setupItemWithContactMetadata()
        expect(wrapper).toMatchSnapshot();
    })

    it('Item with DistributionUrl', () => {
        const { wrapper } = setupItemWithContactMetadata()

        expect(wrapper.hasClass(style.btn)).toBe(true)
        expect(wrapper.prop("href")).toBe('mailto:test')
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('envelope')        
        expect(wrapper.find("span").first().html()).toContain('Kontakt dataeier')
    })

    it('Item without DistributionUrl', () => {
        const { wrapper } = setupItemWithoutContactMetadata()
        
        expect(wrapper.hasClass(style.btn + ' disabled')).toBe(true)
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('envelope')        
        expect(wrapper.find("span").first().html()).toContain('Kontakt dataeier')
    })
})

import React from 'react';
import { shallow } from "enzyme";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HelpButton } from './HelpButton';
import style from './Buttons.scss'

function setupItemWithHelpUrl() {
    const metadata = {
        Uuid: '1234',
        HelpUrl: 'test'
    }
    const props = {
        metadata: metadata
    }
    const wrapper = shallow(<HelpButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemWithoutHelpUrl() {
    const metadata = {
        Uuid: '1234',
    }
    const props = {
        metadata: metadata
    }
    const wrapper = shallow(<HelpButton {...props} />)

    return {
        props,
        wrapper
    }
}


describe('setupItemWithHelpUrl', () => {
    
    it('should render self', () => {
        const { wrapper } = setupItemWithHelpUrl()
        expect(wrapper).toMatchSnapshot();
    })

    it('Item with help url', () => {
        const { wrapper } = setupItemWithHelpUrl()

        expect(wrapper.hasClass(style.btn)).toBe(true)
        expect(wrapper.prop("href")).toBe('test')
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')        
        expect(wrapper.find("span").first().html()).toContain('Hjelp')
    })

    it('Item without help url', () => {
        const { wrapper } = setupItemWithoutHelpUrl()
        
        expect(wrapper.hasClass(style.btn + ' disabled')).toBe(true)
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')        
        expect(wrapper.find("span").first().html()).toContain('Hjelp')
    })
})
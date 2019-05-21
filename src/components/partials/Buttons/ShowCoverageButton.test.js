import React from 'react';
import { shallow } from "enzyme";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ShowCoverageButton } from './ShowCoverageButton';
import style from './Buttons.scss'

function setupItemWithCoverageUrl() {
    const metadata = {
        Uuid: '1234',
        CoverageUrl: 'test'
    }
    const props = {
        metadata: metadata
    }
    const wrapper = shallow(<ShowCoverageButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemWithoutCoverageUrl() {
    const metadata = {
        Uuid: '1234',
    }
    const props = {
        metadata: metadata
    }
    const wrapper = shallow(<ShowCoverageButton {...props} />)

    return {
        props,
        wrapper
    }
}


describe('setupItemWithCoverageUrl', () => {
    
    it('should render self', () => {
        const { wrapper } = setupItemWithCoverageUrl()
        expect(wrapper).toMatchSnapshot();
    })

    it('Item with coverage url', () => {
        const { wrapper } = setupItemWithCoverageUrl()

        wrapper.setState({
            show: true
        });
        
        expect(wrapper.children('span').hasClass(style.btn)).toBe(true)
        expect(wrapper.children('span').prop("onClick").toString()).toContain("show: true")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('globe')        
        expect(wrapper.find("span").first().html()).toContain('Vis dekningskart')
        expect(wrapper.find("iframe").prop("src")).toBe("test")
    })

    it('Item without coverage url', () => {
        const { wrapper } = setupItemWithoutCoverageUrl()
        
        expect(wrapper.children('span').hasClass(style.btn + ' disabled')).toBe(true)
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('globe')        
        expect(wrapper.find("span").first().html()).toContain('Vis dekningskart')
    })
})

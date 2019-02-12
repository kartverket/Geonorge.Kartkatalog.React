import React from 'react';
import { shallow } from "enzyme";
import { ApplicationButton } from './ApplicationButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function setupApplicationWithDistributionUrl() {
    const searchResult = {
        Uuid: '1234',
        Type: 'software',
        DistributionUrl: 'test'
    }
    const props = {
        searchResult: searchResult
    }
    const wrapper = shallow(<ApplicationButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupApplicationWithoutDistributionUrl() {
    const searchResult = {
        Uuid: '1234',
        Type: 'software',
    }
    const props = {
        searchResult: searchResult
    }
    const wrapper = shallow(<ApplicationButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupIsDatasetType() {
    const searchResult = {
        Uuid: '1234',
        Type: 'dataset',
    }
    const props = {
        searchResult: searchResult
    }
    const wrapper = shallow(<ApplicationButton {...props} />)

    return {
        props,
        wrapper
    }
}


describe('ApplicationButton', () => {
    
    it('should render self', () => {
        const { wrapper } = setupApplicationWithDistributionUrl()
        expect(wrapper).toMatchSnapshot();
    })

    it('Application with DistributionUrl', () => {
        const { wrapper } = setupApplicationWithDistributionUrl()

        expect(wrapper.hasClass('on')).toBe(true)
        expect(wrapper.prop("href")).toBe('test')
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')        
        expect(wrapper.find("span").first().html()).toContain('Til nettside')
    })

    it('Application without DistributionUrl', () => {
        const { wrapper } = setupApplicationWithoutDistributionUrl()
        
        expect(wrapper.hasClass('off')).toBe(true)
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')        
        expect(wrapper.find("span").first().html()).toContain('ikke tilgjengelig')
    })

    it('Is dataset type', () => {
        const { wrapper } = setupIsDatasetType()
        
        expect(wrapper.hasClass()).toBe(false)
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon)).toHaveLength(0)        
        expect(wrapper.find("span")).toHaveLength(0)
    })
})

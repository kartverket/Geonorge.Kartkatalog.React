import React from 'react';
import { shallow } from "enzyme";
import { MapButton } from './MapButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function setupSearchResultWithShowMapLinkTrue() {
    const searchResult = {
        ShowMapLink: true
    }
    const props = {
        searchResult: searchResult,
    }
    const wrapper = shallow(<MapButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupSearchResultWithShowMapLinkFalse() {
    const searchResult = {
        ShowMapLink: false
    }
    const props = {
        searchResult: searchResult,
    }
    const wrapper = shallow(<MapButton {...props} />)

    return {
        props,
        wrapper
    }
}



describe('MapButton', () => {
    
    it('should render self', () => {
        const { wrapper } = setupSearchResultWithShowMapLinkTrue()
        expect( wrapper).toMatchSnapshot();
    })

    it('Searchresult with ShowMapLink true and isAdded false', () => {
        let { wrapper } = setupSearchResultWithShowMapLinkTrue()
        wrapper = wrapper.setState({isAdded: false})

        expect(wrapper.prop("className")).toContain("on")
        expect(wrapper.prop("onClick").toString()).toContain("addToMap(mapItem)")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-plus')        
        expect(wrapper.find("span").first().html()).toContain('Legg til i kart')
    })

    it('Searchresult with ShowMapLink true and isAdded true', () => {
        let { wrapper } = setupSearchResultWithShowMapLinkTrue()
        wrapper = wrapper.setState({isAdded: true})
        
        expect(wrapper.prop("className")).toContain("off")
        expect(wrapper.prop("onClick").toString()).toContain("removeFromMap(mapItem)")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-minus')        
        expect(wrapper.find("span").first().html()).toContain('Fjern fra kart')
    })

    it('Searchresult with ShowMapLink false', () => {
        let { wrapper } = setupSearchResultWithShowMapLinkFalse()
        
        expect(wrapper.hasClass()).toBe(false)
        expect(wrapper.prop("onClick")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon)).toHaveLength(0)        
        expect(wrapper.find("span")).toHaveLength(0)

    })

})

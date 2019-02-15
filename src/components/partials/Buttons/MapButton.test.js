import React from 'react';
import { shallow } from "enzyme";
import { MapButton } from './MapButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { wrap } from 'module';

function setupServiceWithShowMapLinkTrue() {
    const searchResult = {
        ShowMapLink: true,
        Uuid: "1234",
        Title: "Test title",
        DistributionProtocol: "test protocol",
        GetCapabilitiesUrl: "test url",
        addLayers: [],
        Type: "service"
    }
    const props = {
        searchResult: searchResult,
        addMapItem: jest.fn(),
        removeMapItem: jest.fn()
    }
    const wrapper = shallow(<MapButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupDatasetWithShowMapLinkTrue() {
    const searchResult = {
        ShowMapLink: true,
        Uuid: "1234",
        Title: "Test title",
        DistributionProtocol: "test protocol",
        GetCapabilitiesUrl: "test url",
        addLayers: [],
        Type: "dataset",
        DatasetServicesWithShowMapLink: [
            {
                Uuid: "1111",
                Title: "Test title",
                DistributionProtocol: "test protocol",
                GetCapabilitiesUrl: "test url",
                addLayers: []
            },
            {
                Uuid: "2222",
                Title: "Test title",
                DistributionProtocol: "test protocol",
                GetCapabilitiesUrl: "test url",
                addLayers: []
            }
        ]

    }
    const props = {
        searchResult: searchResult,
        addMapItem: jest.fn(),
        removeMapItem: jest.fn()
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
        const { wrapper } = setupServiceWithShowMapLinkTrue()
        expect(wrapper).toMatchSnapshot();
    })

    it('Service with ShowMapLink true and isAdded false', () => {
        let { wrapper } = setupServiceWithShowMapLinkTrue()

        expect(wrapper.prop("className")).toContain("on")
        expect(wrapper.prop("onClick").toString()).toContain("addToMap([mapItem])")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-plus')
        expect(wrapper.find("span").first().html()).toContain('Legg til i kart')
    })

    it('Dataset with ShowMapLink true and isAdded false', () => {
        let { wrapper } = setupDatasetWithShowMapLinkTrue()

        expect(wrapper.prop("className")).toContain("on")
        expect(wrapper.prop("onClick").toString()).toContain("addToMap([mapItem])")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-plus')
        expect(wrapper.find("span").first().html()).toContain('Legg til i kart')
    })

    it('Service with ShowMapLink true and isAdded true', () => {
        let { wrapper } = setupServiceWithShowMapLinkTrue()
        wrapper.setState({
            selectedMapItems: [{
                Uuid: "1234",
                Title: "Test title",
                DistributionProtocol: "test protocol",
                GetCapabilitiesUrl: "test url",
                addLayers: Array(0)
            }]
        })

        expect(wrapper.prop("className")).toContain("off")
        expect(wrapper.prop("onClick").toString()).toContain("removeFromMap([mapItem])")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-minus')
        expect(wrapper.find("span").first().html()).toContain('Fjern fra kart')
    })

    it('Service with ShowMapLink true and isAdded true', () => {
        let { wrapper } = setupDatasetWithShowMapLinkTrue()
        wrapper.setState({
            selectedMapItems: [{
                Uuid: "1234",
                Title: "Test title",
                DistributionProtocol: "test protocol",
                GetCapabilitiesUrl: "test url",
                addLayers: Array(0)
            }]
        })

        expect(wrapper.prop("className")).toContain("off")
        expect(wrapper.prop("onClick").toString()).toContain("removeFromMap([mapItem])")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-minus')
        expect(wrapper.find("span").first().html()).toContain('Fjern fra kart')
    })


    it('Service with ShowMapLink false', () => {
        let { wrapper } = setupSearchResultWithShowMapLinkFalse()

        expect(wrapper.hasClass()).toBe(false)
        expect(wrapper.prop("onClick")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon)).toHaveLength(0)
        expect(wrapper.find("span")).toHaveLength(0)

    })

})

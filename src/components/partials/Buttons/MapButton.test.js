import React from 'react';
import { shallow } from "enzyme";
import { MapButton } from './MapButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Buttons.scss'

function setupServiceWithShowMapLinkTrue() {
    const metadata = {
        ShowMapLink: true,
        Uuid: "1234",
        Title: "Test title",
        DistributionProtocol: "test protocol",
        GetCapabilitiesUrl: "test url",
        addLayers: [],
        Type: "service"
    }
    const mapItems = [];
    const props = {
        metadata: metadata,
        mapItems: mapItems,
        addMapItem: jest.fn(),
        removeMapItem: jest.fn(),
        getResource: jest.fn(),
        listButton: true
    }
    const wrapper = shallow(<MapButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupDatasetWithShowMapLinkTrue() {
    const metadata = {
        ShowMapLink: true,
        Uuid: "1111",
        Title: "Test title",
        DistributionProtocol: "test protocol",
        GetCapabilitiesUrl: "test url",
        addLayers: [],
        Type: "dataset",
        DatasetServicesWithShowMapLink: [
            {
                Uuid: "1234",
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
    const mapItems = [];
    const props = {
        metadata: metadata,
        mapItems: mapItems,
        addMapItem: jest.fn(),
        removeMapItem: jest.fn(),
        getResource: jest.fn()
    }
    const wrapper = shallow(<MapButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupMetadataWithShowMapLinkFalse() {
    const metadata = {
        ShowMapLink: false
    }
    const mapItems = [];
    const props = {
        metadata: metadata,
        mapItems: mapItems,
        addMapItem: jest.fn(),
        removeMapItem: jest.fn(),
        getResource: jest.fn()
    }
    const wrapper = shallow(<MapButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemListButtonFalseAndCanShowMapUrl() {
    const metadata = {
        CanShowMapUrl: true,
        DistributionDetails: {
            Protocol: "test protocol"
        },
        Uuid: "1234",
        Title: "Test title",
        MapLink: "test url",
        addLayers: [],
    }
    const mapItems = [];
    const props = {
        metadata: metadata,
        mapItems: mapItems,
        addMapItem: jest.fn(),
        removeMapItem: jest.fn(),
        getResource: jest.fn(),
        listButton: false
    }
    const wrapper = shallow(<MapButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemListButtonFalseAndCanShowServiceMapUrl() {
    const metadata = {
        CanShowServiceMapUrl: true,
        ServiceDistributionProtocolForDataset: "test protocol",
        Uuid: "1234",
        Title: "Test title",
        MapLink: "test url",
        addLayers: []
    }
    const mapItems = [];
    const props = {
        metadata: metadata,
        mapItems: mapItems,
        addMapItem: jest.fn(),
        removeMapItem: jest.fn(),
        getResource: jest.fn(),
        listButton: false
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
    })

    it('Dataset with ShowMapLink true and isAdded false', () => {
        let { wrapper } = setupDatasetWithShowMapLinkTrue()

        expect(wrapper.prop("className")).toContain("on")
        expect(wrapper.prop("onClick").toString()).toContain("addToMap([mapItem])")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-plus')
    })

    it('Service with ShowMapLink true and isAdded true', () => {
        let { wrapper } = setupServiceWithShowMapLinkTrue()

        wrapper.setProps({
            mapItems: [
                {
                    Uuid: "1234",
                    Title: "Test title",
                    DistributionProtocol: "test protocol",
                    GetCapabilitiesUrl: "test url",
                    addLayers: Array(0)
                }
            ]
        });

        expect(wrapper.prop("className")).toContain("off")
        expect(wrapper.prop("onClick").toString()).toContain("removeFromMap([mapItem])")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-minus')
    })

    it('Dataset with ShowMapLink true and isAdded true', () => {
        let { wrapper } = setupDatasetWithShowMapLinkTrue()
        wrapper.setProps({
            mapItems: [
                {
                    Uuid: "1234",
                    Title: "Test title",
                    DistributionProtocol: "test protocol",
                    GetCapabilitiesUrl: "test url",
                    addLayers: Array(0)
                }
            ]
        });

        expect(wrapper.prop("className")).toContain("off")
        expect(wrapper.prop("onClick").toString()).toContain("removeFromMap([mapItem])")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-minus')
    })


    it('Item with ShowMapLink false', () => {
        let { wrapper } = setupMetadataWithShowMapLinkFalse()

        expect(wrapper.hasClass()).toBe(false)
        expect(wrapper.prop("onClick")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon)).toHaveLength(0)
        expect(wrapper.find("span")).toHaveLength(0)

    })


    // Button
    it('List button false - Item with CanShowMapUrl and isAdded false', () => {
        let { wrapper } = setupItemListButtonFalseAndCanShowMapUrl()

        expect(wrapper.prop("className")).toContain(style.btn + ' download')
        expect(wrapper.prop("onClick").toString()).toContain("addToMap([mapItem])")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-plus')
    })

    it('List button false - Item with CanShowMapUrl and isAdded', () => {
        let { wrapper } = setupItemListButtonFalseAndCanShowMapUrl()
        wrapper.setProps({
            mapItems: [
                {
                    Uuid: "1234",
                    Title: "Test title",
                    DistributionProtocol: "test protocol",
                    GetCapabilitiesUrl: "test url",
                    addLayers: Array(0)
                }
            ]
        });

        expect(wrapper.prop("className")).toContain(style.btn + ' remove')
        expect(wrapper.prop("onClick").toString()).toContain("removeFromMap([mapItem])")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-minus')
    })

    it('List button false - Item with CanShowServiceMapUrl and isAdded false', () => {
        let { wrapper } = setupItemListButtonFalseAndCanShowServiceMapUrl()

        expect(wrapper.prop("className")).toContain(style.btn + ' download')
        expect(wrapper.prop("onClick").toString()).toContain("addToMap([mapItem])")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-plus')
    })

    it('List button false - Item with CanShowServiceMapUrl and isAdded', () => {
        let { wrapper } = setupItemListButtonFalseAndCanShowServiceMapUrl()
        wrapper.setProps({
            mapItems: [
                {
                    Uuid: "1234",
                    Title: "Test title",
                    DistributionProtocol: "test protocol",
                    GetCapabilitiesUrl: "test url",
                    addLayers: Array(0)
                }
            ]
        });

        expect(wrapper.prop("className")).toContain(style.btn + ' remove')
        expect(wrapper.prop("onClick").toString()).toContain("removeFromMap([mapItem])")
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('map-marker-minus')
    })
})

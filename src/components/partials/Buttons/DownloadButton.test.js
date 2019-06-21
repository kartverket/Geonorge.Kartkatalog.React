import React from 'react';
import {shallow} from "enzyme";
import {DownloadButton} from './DownloadButton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import style from './Buttons.scss'

function setupMetadataDownloadButton() {
    const metadata = {
        DistributionProtocol: "GEONORGE:DOWNLOAD"
    };
    const itemsToDownload = [];
    const props = {
        metadata: metadata,
        itemsToDownload: itemsToDownload,
        addItemSelectedForDownload: jest.fn(),
        removeItemSelectedForDownload: jest.fn(),
        getResource: jest.fn()
    };
    const wrapper = shallow(<DownloadButton {...props} />);

    return {
        props,
        wrapper
    }
}

function setupMetadataDownloadLink() {
    const metadata = {
        DistributionUrl: "test.no",
        DistributionProtocol: "WWW:DOWNLOAD-1.0-http--download",
        Type: "dataset"
    };
    const itemsToDownload = [];
    const props = {
        metadata: metadata,
        itemsToDownload: itemsToDownload,
        addItemSelectedForDownload: jest.fn(),
        removeItemSelectedForDownload: jest.fn(),
        getResource: jest.fn()
    };
    const wrapper = shallow(<DownloadButton {...props} />);

    return {
        props,
        wrapper
    }
}

function setupMetadataListButtonFalse() {
    const metadata = {
    };
    const itemsToDownload = [];
    const props = {
        metadata: metadata,
        itemsToDownload: itemsToDownload,
        addItemSelectedForDownload: jest.fn(),
        removeItemSelectedForDownload: jest.fn(),
        getResource: jest.fn(),
        listButton: false
    };
    const wrapper = shallow(<DownloadButton {...props} />);

    return {
        props,
        wrapper
    }
}

function setupMetadataListButtonFalseAndCanShowDownloadService() {
    const metadata = {
        CanShowDownloadService: true
    };
    const itemsToDownload = [];
    const props = {
        metadata: metadata,
        itemsToDownload: itemsToDownload,
        addItemSelectedForDownload: jest.fn(),
        removeItemSelectedForDownload: jest.fn(),
        getResource: jest.fn(),
        listButton: false
    };
    const wrapper = shallow(<DownloadButton {...props} />);

    return {
        props,
        wrapper
    }
}

function setupMetadataListButtonFalseAndCanShowDownloadUrl() {
    const metadata = {
        CanShowDownloadUrl: true,
        DistributionUrl: 'test.no'
    };
    const itemsToDownload = [];
    const props = {
        metadata: metadata,
        itemsToDownload: itemsToDownload,
        addItemSelectedForDownload: jest.fn(),
        removeItemSelectedForDownload: jest.fn(),
        getResource: jest.fn(),
        listButton: false
    };
    const wrapper = shallow(<DownloadButton {...props} />);

    return {
        props,
        wrapper
    }
}


describe('DownloadButton', () => {


    // List button
    it('should render self', () => {
        const {wrapper} = setupMetadataDownloadButton();
        expect(wrapper).toMatchSnapshot();
    });

    it('Show download button when item is selected for download', () => {
        let {wrapper} = setupMetadataDownloadButton();
        wrapper = wrapper.setState({isAdded: true});

        expect(wrapper.prop("className")).toContain("off");
        expect(wrapper.prop("onClick").toString()).toContain("removeFromDownloadList(button)");
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('trash');
        expect(wrapper.find("span").first().html()).toContain('Fjern nedlasting');
    });

    it('Show download button when item is not selected for download', () => {
        let {wrapper} = setupMetadataDownloadButton();
        wrapper = wrapper.setState({isAdded: false});

        expect(wrapper.prop("className")).toContain("on");
        expect(wrapper.prop("onClick").toString()).toContain("addToDownloadList(button)");
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('cloud-download');
        expect(wrapper.find("span").first().html()).toContain('Last ned');
    });

    it('Show download link', () => {
        let {wrapper} = setupMetadataDownloadLink();

        expect(wrapper.prop("className")).toContain("on");
        expect(wrapper.prop("href")).toBe('test.no');
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square');
        expect(wrapper.find("span").first().html()).toContain('Til nedlasting');
    });

    
    // Button

    it('List button false', () => {
        let {wrapper} = setupMetadataListButtonFalse();

        expect(wrapper.prop("className")).toContain(style.btn + ' disabled')
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('cloud-download');
        expect(wrapper.find("span").first().html()).toContain('Last ned');
    });

    it('List button false - CanShowDownloadService true', () => {
        let {wrapper} = setupMetadataListButtonFalseAndCanShowDownloadService();
        wrapper = wrapper.setState({isAdded: false});

        expect(wrapper.prop("className")).toContain(style.btn + ' download')
        expect(wrapper.prop("onClick").toString()).toContain("addToDownloadList(button)");
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('cloud-download');
        expect(wrapper.find("span").first().html()).toContain('Last ned');
    });

    it('List button false - CanShowDownloadUrl true', () => {
        let {wrapper} = setupMetadataListButtonFalseAndCanShowDownloadUrl();

        expect(wrapper.prop("className")).toContain(style.btn)
        expect(wrapper.prop("href")).toBe('test.no');
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square');
        expect(wrapper.find("span").first().html()).toContain('Til nedlasting');
    });
});

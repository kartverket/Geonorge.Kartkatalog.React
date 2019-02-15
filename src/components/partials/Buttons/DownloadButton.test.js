import React from 'react';
import {shallow} from "enzyme";
import {DownloadButton} from './DownloadButton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function setupSearchResultDownloadButton() {
    const searchResult = {
        DistributionProtocol: "GEONORGE:DOWNLOAD"
    };
    const props = {
        searchResult: searchResult,
        addItemSelectedForDownload: jest.fn(),
        removeItemSelectedForDownload: jest.fn()
    };
    const wrapper = shallow(<DownloadButton {...props} />);

    return {
        props,
        wrapper
    }
}

function setupSearchResultDownloadLink() {
    const searchResult = {
        DistributionUrl: "test.no",
        DistributionProtocol: "WWW:DOWNLOAD-1.0-http--download",
        Type: "dataset"
    };
    const props = {
        searchResult: searchResult,
        addItemSelectedForDownload: jest.fn(),
        removeItemSelectedForDownload: jest.fn()
    };
    const wrapper = shallow(<DownloadButton {...props} />);

    return {
        props,
        wrapper
    }
}

describe('DownloadButton', () => {

    it('should render self', () => {
        const {wrapper} = setupSearchResultDownloadButton();
        expect(wrapper).toMatchSnapshot();
    });

    it('Show download button when item is selected for download', () => {
        let {wrapper} = setupSearchResultDownloadButton();
        wrapper = wrapper.setState({isSelectedForDownload: true});

        expect(wrapper.prop("className")).toContain("off");
        expect(wrapper.prop("onClick").toString()).toContain("removeFromDownloadList(button)");
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('trash');
        expect(wrapper.find("span").first().html()).toContain('Fjern nedlasting');
    });

    it('Show download button when item is not selected for download', () => {
        let {wrapper} = setupSearchResultDownloadButton();
        wrapper = wrapper.setState({isSelectedForDownload: false});

        expect(wrapper.prop("className")).toContain("on");
        expect(wrapper.prop("onClick").toString()).toContain("addToDownloadList(button)");
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('cloud-download');
        expect(wrapper.find("span").first().html()).toContain('Last ned');
    });

    it('Show download link', () => {
        let {wrapper} = setupSearchResultDownloadLink();

        expect(wrapper.prop("className")).toContain("on");
        expect(wrapper.prop("href")).toBe('test.no');
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square');
        expect(wrapper.find("span").first().html()).toContain('Til nedlasting');
    });
});

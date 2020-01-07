import React from 'react';
import { shallow } from "enzyme";
import { ApplicationButton } from './ApplicationButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from 'components/partials/Buttons/Buttons.module.scss'

function setupApplicationWithDistributionUrl() {
    const metadata = {
        Uuid: '1234',
        Type: 'software',
        DistributionUrl: 'test'
    }
    const props = {
        metadata: metadata,
        getResource: jest.fn()
    }
    const wrapper = shallow(<ApplicationButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupApplicationWithoutDistributionUrl() {
    const metadata = {
        Uuid: '1234',
        Type: 'software',
    }
    const props = {
        metadata: metadata,
        getResource: jest.fn()
    }
    const wrapper = shallow(<ApplicationButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupIsDatasetType() {
    const metadata = {
        Uuid: '1234',
        Type: 'dataset',
    }
    const props = {
        metadata: metadata,
        getResource: jest.fn()
    }
    const wrapper = shallow(<ApplicationButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupListButtonFalse() {
    const metadata = {

    }
    const props = {
        metadata: metadata,
        listButton: false,
        getResource: jest.fn()
    }
    const wrapper = shallow(<ApplicationButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemWithListButtonFalseAndCanShowWebsiteUrlAndDistributionUrl() {
    const metadata = {
        Uuid: '1234',
        CanShowWebsiteUrl: true,
        DistributionUrl: 'test'
    }
    const props = {
        metadata: metadata,
        listButton: false,
        getResource: jest.fn()
    }
    const wrapper = shallow(<ApplicationButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemWithListButtonFalseAndCanShowWebsiteUrl() {
    const metadata = {
        Uuid: '1234',
        CanShowWebsiteUrl: true,
    }
    const props = {
        metadata: metadata,
        listButton: false,
        getResource: jest.fn()
    }
    const wrapper = shallow(<ApplicationButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemWithListButtonFalseAndCanShowWebsiteUrlFalseAndDistributionUrl() {
    const metadata = {
        Uuid: '1234',
        DistributionUrl: 'test',
        CanShowWebsiteUrl: false,
    }
    const props = {
        metadata: metadata,
        listButton: false,
        getResource: jest.fn()
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

        expect(wrapper.hasClass('ext')).toBe(true)
        expect(wrapper.prop("href")).toBe('test')
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')
    })

    it('Application without DistributionUrl', () => {
        const { wrapper } = setupApplicationWithoutDistributionUrl()

        expect(wrapper.hasClass('off')).toBe(true)
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')
    })

    it('Is dataset type', () => {
        const { wrapper } = setupIsDatasetType()

        expect(wrapper.hasClass()).toBe(false)
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon)).toHaveLength(0)
        expect(wrapper.find("span")).toHaveLength(0)
    })
})

it('List button false', () => {
    const { wrapper } = setupListButtonFalse()

    expect(wrapper.hasClass(style.btn + ' disabled')).toBe(true)
    expect(wrapper.prop("href")).toBeUndefined()
    expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')
})

it('List button false and Item with CanShowWebsiteUrl and DistributionUrl', () => {
    const { wrapper } = setupItemWithListButtonFalseAndCanShowWebsiteUrlAndDistributionUrl()

    expect(wrapper.hasClass(style.btn)).toBe(true)
    expect(wrapper.prop("href")).toBe('test')
    expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')
})

it('List button false and Item with CanShowWebsiteUrl and no DistributionUrl', () => {
    const { wrapper } = setupItemWithListButtonFalseAndCanShowWebsiteUrl()

    expect(wrapper.hasClass(style.btn + ' disabled')).toBe(true)
    expect(wrapper.prop("href")).toBeUndefined()
    expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')
})

it('List button false and Item with DistributionUrl and CanShowWebsiteUrl false', () => {
    const { wrapper } = setupItemWithListButtonFalseAndCanShowWebsiteUrlFalseAndDistributionUrl()

    expect(wrapper.hasClass(style.btn + ' disabled')).toBe(true)
    expect(wrapper.prop("href")).toBeUndefined()
    expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('external-link-square')
})

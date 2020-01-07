import React from 'react';
import { shallow } from "enzyme";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProductSpecificationButton } from './ProductSpecificationButton';
import style from 'components/partials/Buttons/Buttons.module.scss';

function setupItemWithProductSpecificationUrl() {
    const metadata = {
        Uuid: '1234',
        ProductSpecificationUrl: 'test'
    }
    const props = {
        metadata: metadata,
        getResource: jest.fn()
    }
    const wrapper = shallow(<ProductSpecificationButton {...props} />)

    return {
        props,
        wrapper
    }
}

function setupItemWithoutProductSpecificationUrl() {
    const metadata = {
        Uuid: '1234',
    }
    const props = {
        metadata: metadata,
        getResource: jest.fn()
    }
    const wrapper = shallow(<ProductSpecificationButton {...props} />)

    return {
        props,
        wrapper
    }
}


describe('ProductsheetButton', () => {

    it('should render self', () => {
        const { wrapper } = setupItemWithProductSpecificationUrl()
        expect(wrapper).toMatchSnapshot();
    })

    it('Item with DistributionUrl', () => {
        const { wrapper } = setupItemWithProductSpecificationUrl()

        expect(wrapper.hasClass(style.btn)).toBe(true)
        expect(wrapper.prop("href")).toBe('test')
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('file-spreadsheet')
    })

    it('Item without DistributionUrl', () => {
        const { wrapper } = setupItemWithoutProductSpecificationUrl()

        expect(wrapper.hasClass(style.btn + ' disabled')).toBe(true)
        expect(wrapper.prop("href")).toBeUndefined()
        expect(wrapper.find(FontAwesomeIcon).first().prop("icon")).toContain('file-spreadsheet')
    })
})

import React from 'react';
import { shallow } from "enzyme";
import { MainNavigation } from './MainNavigation';

import SearchBar from './MainNavigation/SearchBar';

import style from './MainNavigation.scss'

function setup() {
  const props = {
    fetchMapItems: jest.fn(),
    removeMapItem: jest.fn(),
    fetchItemsToDownload: jest.fn(),
    removeItemSelectedForDownload: jest.fn(),
    getDownloadItemMetadata: jest.fn(),
    fetchGeonorgeMenu: jest.fn(),
    getGeonorgeLogo: jest.fn(),
    autoAddItemFromLocalStorage: jest.fn(),
    getResource: jest.fn(),
    updateOidcCookie: jest.fn(),
    geonorgeMenu: [],
    mapItems: [],
    itemsToDownload: []
  }

  const wrapper = shallow(<MainNavigation {...props} />)

  return {
    props,
    wrapper
  }
}

describe('MainNavigation', () => {
  it('should render self and subcomponents', () => {
    const { wrapper } = setup()
    expect(wrapper.hasClass(style.mainNavigationContainer)).toBe(true);
    expect(wrapper.find('img').length).toBe(1);
    expect(wrapper.find(SearchBar).length).toBe(1);
    expect(wrapper).toMatchSnapshot();
  })

  it('should include 1 SearchBar component', () => {
    const { wrapper } = setup()
    expect(wrapper.find(SearchBar).length).toBe(1);
  })

  it('should call fetchMapItems on mount', () => {
    const { props } = setup()
    expect(props.fetchMapItems.mock.calls.length).toBe(1)
  })

  it('should call fetchItemsToDownload on mount', () => {
    const { props } = setup()
    expect(props.fetchItemsToDownload.mock.calls.length).toBe(1)
  })
})

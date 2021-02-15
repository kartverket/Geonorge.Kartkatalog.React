import React from 'react';
import { shallow } from "enzyme";
import { MainNavigationContainer } from './MainNavigationContainer';

import SearchBar from './MainNavigation/SearchBar';

import style from './MainNavigationContainer.module.scss'

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
    updateBaatInfo: jest.fn(),
    geonorgeMenu: [],
    mapItems: [],
    itemsToDownload: []
  }

  const wrapper = shallow(<MainNavigationContainer {...props} />)

  return {
    props,
    wrapper
  }
}

describe('MainNavigation', () => {

  it('should call fetchMapItems on mount', () => {
    const { props } = setup()
    expect(props.fetchMapItems.mock.calls.length).toBe(1)
  })

  it('should call fetchItemsToDownload on mount', () => {
    const { props } = setup()
    expect(props.fetchItemsToDownload.mock.calls.length).toBe(1)
  })
})

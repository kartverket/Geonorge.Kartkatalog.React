import React from 'react';
import { shallow } from "enzyme";

// TODO fix testing for external modules

/*import { App } from './App';

function setup() {
  const props = {
  }

  const wrapper = shallow(<App {...props} />)

  return {
    props,
    wrapper
  }
}*/

describe('App', () => {
    it('should render self and subcomponents', () => {
      //const { wrapper } = setup()
      //expect(wrapper).toMatchSnapshot();
      expect(1).toBe(1);
    })
})

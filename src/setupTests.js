import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'regenerator-runtime/runtime'
import 'whatwg-fetch'
import 'layout/icons'

jest.setTimeout(30000);
configure({ adapter: new Adapter() });

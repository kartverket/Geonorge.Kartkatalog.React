import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'whatwg-fetch'
import './layout/icons';

configure({ adapter: new Adapter() });

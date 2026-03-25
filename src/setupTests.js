//import { configure } from 'enzyme';
//import Adapter from 'enzyme-adapter-react-16';
import 'regenerator-runtime/runtime'
import 'whatwg-fetch'
import 'layout/icons'

jest.setTimeout(30000);
//configure({ adapter: new Adapter() });


//Kommentert ut, ettersom det forstyrret testing på reducers og helpers. Skapte ReferenceError: ReadableStream is not defined, så resten av testene fikk ikke startet. 
//Virker som komponent testing med enzyme ikke er i bruk. Kan virke som om det var en plan om å teste noe moduler, men at det ikke har blitt ordentlig satt inn. 
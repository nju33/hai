import {createStore} from 'redux';
import reducer from './reducer';

const store = createStore(reducer);

console.log(123123);
if (process.env.NODE_ENV === 'development') {
  store.subscribe(() => {
    console.info('State changed');
    console.log(store.getState());
  });
}

export default store;

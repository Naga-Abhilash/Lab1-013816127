import {createStore} from 'redux';
import AllReducers from '../reducers/AllReducers'

const store = createStore(
    AllReducers,
    window.devToolsExtension && window.devToolsExtension()
)

export default store;
import Vue from 'vue';
import Vuex from 'vuex';

import {listStore} from './listcontact.store'

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        listStore
    }
})

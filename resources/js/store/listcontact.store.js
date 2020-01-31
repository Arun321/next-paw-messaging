const state = {
    triggerFilteredContacts: 0
}

const actions = {
    TRIGGER_FILTERED_CONTACTS_ACTION (context) {
        context.commit('TRIGGER_FILTERED_CONTACTS_MUTATION')
    }
}

const mutations = {
    TRIGGER_FILTERED_CONTACTS_MUTATION (state) {
        state.triggerFilteredContacts = !state.triggerFilteredContacts
    }
}

export const listStore = {
    namespaced: true,
    state,
    actions,
    mutations
}

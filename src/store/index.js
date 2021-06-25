import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // AUTH
    vuexRestUrl: "/api/notes/",
    vuexCredentials: "",
    vuexIsUserAuthenticated: false,

    // MODAL
    vuexIsModalVisible: false,
    vuexModalType: "",

    // NOTES
    vuexNotes: [],
    vuexEditNoteId: "",

    // LOADING
    vuexIsLoading: false,
  },
  mutations: {
    // AUTH
    vuexSetCredentials(state, credentials) {
      state.vuexCredentials = credentials;
    },
    vuexSetUserAuthenticated(state, isUserAuthenticated) {
      state.vuexIsUserAuthenticated = isUserAuthenticated;
    },

    // MODAL
    vuexToggleModalVisibility(state, isVisible) {
      state.vuexIsModalVisible = isVisible;
    },
    vuexSetModalType(state, type) {
      state.vuexModalType = type;
    },

    // NOTES
    vuexGetNotes(state, response) {
      state.vuexNotes = response.data;
    },
    vuexStringToJsonNotes(state) {
      state.vuexNotes.forEach((note) => {
        if (note.todos !== "") {
          note.todos = JSON.parse(note.todos);
        }
      });
    },
    vuexSetEditNoteById(state, noteId) {
      state.vuexEditNoteId = noteId;
    },
    vuexPutTodos(state, todos) {
      state.vuexNotes.todos = todos;
    },

    // LOADING
    vuexToggleLoadingState(state, isLoading) {
      state.vuexIsLoading = isLoading;
    },
  },
});

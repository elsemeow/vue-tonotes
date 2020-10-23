<template>
  <section class="container_type_max-width">
    <div class="controls">
      <button class="button" @click="toggleModalAdd(true)">
        Add new note
      </button>
    </div>

    <ul class="grid" v-if="vuexNotes">
      <li v-for="note in vuexNotes" :key="note.id">
        <div class="card card_flex_vertical">
          <div class="card__flex-1">
            <h2 class="heading heading_size_sm">{{ note.title }}</h2>
            <small class="paragraph paragraph_type_small">
              {{ note.date_time }}
            </small>
            <div class="controls controls_flex_right">
              <button
                class="button button_color_error"
                @click="toggleModalDelete(true, note.id)"
              >
                Delete
              </button>
              <button class="button" @click="toggleModalRename(true, note.id)">
                Rename
              </button>
            </div>
            <div v-if="note.todos">
              <div
                class="checkbox__child"
                v-for="(todo, index) in note.todos.slice().reverse()"
                :key="index"
              >
                <div v-if="index <= 1">
                  <label class="checkbox__container">
                    <input
                      class="checkbox"
                      type="checkbox"
                      :checked="todo.checked"
                      disabled
                    /><span class="checkbox__text checkbox__text_ellipsis">{{
                      todo.text
                    }}</span>
                  </label>
                </div>
              </div>
            </div>
            <p class="paragraph" v-else>Add TODOs by clicking "EDIT"</p>
          </div>
          <div class="controls margin-bottom_remove">
            <button class="button" @click="vuexSetEditNoteById(note.id)">
              Edit
            </button>
          </div>
        </div>
      </li>
    </ul>
    <div class="card" v-else>
      <h2 class="heading heading_size_sm margin-bottom_size_sm">
        No notes found
      </h2>
      <p class="paragraph">
        Add a new note by clicking on the "ADD NEW NOTE" button
      </p>
    </div>

    <transition name="animation-zoom">
      <div class="modal" v-if="vuexIsModalVisible">
        <div class="card card_type_modal" v-if="vuexModalType === 'add'">
          <h2 class="heading heading_size_sm margin-bottom_size_md">
            Enter a title for the new note
          </h2>
          <input class="input" type="text" v-model="noteTempTitle" />
          <div class="controls controls_flex_right margin-bottom_remove">
            <button
              class="button button_color_error"
              @click="toggleModalAdd(false)"
            >
              Cancel
            </button>
            <button
              class="button"
              @click="addNote(noteTempTitle)"
              :disabled="isAddNotValid"
            >
              Add
            </button>
          </div>
        </div>

        <div class="card card_type_modal" v-if="vuexModalType === 'rename'">
          <h2 class="heading heading_size_sm margin-bottom_size_md">
            Change the title of the selected note
          </h2>
          <input class="input" type="text" v-model="noteLink.title" />
          <div class="controls controls_flex_right margin-bottom_remove">
            <button
              class="button button_color_error"
              @click="toggleModalRename(false, '')"
            >
              Cancel
            </button>
            <button
              class="button"
              @click="renameNote(noteLink.id, noteLink.title)"
              :disabled="isRenameNotValid"
            >
              Save
            </button>
          </div>
        </div>

        <div class="card card_type_modal" v-if="vuexModalType === 'delete'">
          <h2 class="heading heading_size_sm margin-bottom_size_lg">
            Do you confirm that you want to delete the note with the title "{{
              noteLink.title
            }}"?
          </h2>
          <div class="controls controls_flex_right margin-bottom_remove">
            <button
              class="button button_color_error"
              @click="toggleModalDelete(false, '')"
            >
              Cancel
            </button>
            <button class="button" @click="deleteNote(noteLink.id)">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";

export default {
  name: "Notes",
  data: () => ({
    noteLink: {},
    noteTempTitle: "",
  }),
  computed: {
    ...mapState([
      "vuexRestUrl",
      "vuexCredentials",
      "vuexIsModalVisible",
      "vuexModalType",
      "vuexNotes",
      "vuexEditNoteId",
    ]),

    // VALIDATE INPUTS
    isAddNotValid: function() {
      return this.noteTempTitle === "";
    },

    isRenameNotValid: function() {
      return (
        this.noteLink.title === this.noteTempTitle || this.noteLink.title === ""
      );
    },
  },
  methods: {
    ...mapMutations([
      "vuexToggleModalVisibility",
      "vuexSetModalType",
      "vuexGetNotes",
      "vuexStringToJsonNotes",
      "vuexSetEditNoteById",
      "vuexToggleLoadingState",
    ]),

    // CONFIGS FOR REQUESTS
    requestConfig(method, data) {
      return {
        method: method,
        url: this.vuexRestUrl,
        headers: {
          Authorization: `Basic ${this.vuexCredentials}`,
        },
        data: data,
      };
    },

    // GET ALL NOTES
    getAllNotes() {
      this.vuexToggleLoadingState(true);

      axios(this.requestConfig("get", ""))
        .then((response) => {
          this.vuexGetNotes(response.data);
          this.vuexStringToJsonNotes();
          if (this.vuexIsModalVisible) {
            this.vuexToggleModalVisibility(false);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 404) {
              this.vuexGetNotes([]);
              if (this.vuexIsModalVisible) {
                this.vuexToggleModalVisibility(false);
              }
            } else {
              console.log(error.response.data);
            }
          }
        })
        .then(() => {
          this.vuexToggleLoadingState(false);
        });
    },

    // FIND NOTE BY ID IN VUEX STORE AND ADD LINK TO DATA
    setNoteLink(noteId) {
      this.noteLink = this.vuexNotes.find(({ id }) => id === noteId);
    },

    // ADD NOTE
    toggleModalAdd(isVisible) {
      this.vuexSetModalType("add");
      this.noteTempTitle = "";
      this.vuexToggleModalVisibility(isVisible);
    },

    addNote(noteTitle) {
      this.vuexToggleLoadingState(true);

      axios(this.requestConfig("post", { title: noteTitle, todos: "" }))
        .then((response) => {
          this.getAllNotes();
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          }
        })
        .then(() => {
          this.vuexToggleLoadingState(false);
        });
    },

    // RENAME NOTE
    toggleModalRename(isVisible, noteId) {
      if (isVisible || noteId) {
        this.vuexSetModalType("rename");
        this.setNoteLink(noteId);
        this.noteTempTitle = this.noteLink.title;
      } else {
        this.noteLink.title = this.noteTempTitle;
      }

      this.vuexToggleModalVisibility(isVisible);
    },

    renameNote(noteId, noteTitle) {
      this.vuexToggleLoadingState(true);

      axios(this.requestConfig("put", { id: noteId, title: noteTitle }))
        .then((response) => {
          this.getAllNotes();
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          }
        })
        .then(() => {
          this.vuexToggleLoadingState(false);
        });
    },

    // DELETE NOTE
    toggleModalDelete(isVisible, noteId) {
      this.vuexSetModalType("delete");
      if (noteId) {
        this.setNoteLink(noteId);
      }

      this.vuexToggleModalVisibility(isVisible);
    },

    deleteNote(noteId) {
      this.vuexToggleLoadingState(true);

      axios(this.requestConfig("delete", { id: noteId }))
        .then((response) => {
          this.getAllNotes();
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
          }
        })
        .then(() => {
          this.vuexToggleLoadingState(false);
        });
    },
  },
  mounted() {
    this.getAllNotes();
  },
};
</script>

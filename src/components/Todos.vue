<template>
  <section class="container_type_max-width">
    <h1 class="heading heading_size_lg margin-top_size_lg margin-horizontal">
      {{ vuexNotes.title }}
    </h1>
    <small class="paragraph paragraph_type_small margin-horizontal">
      {{ vuexNotes.date_time }}
    </small>

    <div class="controls">
      <button class="button button_color_error" @click="goBack()">
        Back
      </button>
      <button
        class="button"
        @click="pushChanges()"
        :disabled="historyState === ''"
      >
        Save
      </button>
      <button class="button" @click="toggleModalAdd(true)">
        Add new TODO
      </button>
      <button
        class="button"
        @click="makeUndo()"
        :disabled="historyState !== 'undo'"
      >
        UNDO
      </button>
      <button
        class="button"
        @click="makeRedo()"
        :disabled="historyState !== 'redo'"
      >
        REDO
      </button>
    </div>

    <div class="reverse" v-if="vuexNotes.todos">
      <div
        class="card margin-bottom_size_sm"
        v-for="(todo, index) in vuexNotes.todos"
        :key="index"
      >
        <label class="checkbox__container checkbox__container_type_todo">
          <input
            class="checkbox"
            type="checkbox"
            @click="setUndo()"
            v-model="todo.checked"
          /><span class="checkbox__text">{{ todo.text }}</span>
        </label>

        <div class="controls margin-bottom_remove">
          <button
            class="button button_color_error"
            @click="toggleModalDelete(true, index)"
          >
            Delete
          </button>
          <button class="button" @click="toggleModalEdit(true, index)">
            Edit
          </button>
        </div>
      </div>
    </div>
    <div class="card" v-else>
      <h2 class="heading heading_size_sm margin-bottom_size_sm">
        No TODOs found
      </h2>
      <p class="paragraph">
        Add a new TODO by clicking on the "ADD NEW TODO" button
      </p>
    </div>

    <transition name="animation-zoom">
      <div class="modal" v-if="vuexIsModalVisible">
        <div class="card card_type_modal" v-if="vuexModalType === 'add'">
          <h2 class="heading heading_size_sm margin-bottom_size_md">
            Enter a text of the new TODO
          </h2>
          <input class="input" type="text" v-model="todoTempText" />
          <div class="controls controls_flex_right margin-bottom_remove">
            <button
              class="button button_color_error"
              @click="toggleModalAdd(false)"
            >
              Cancel
            </button>
            <button class="button" @click="addTodo()" :disabled="isAddNotValid">
              Add
            </button>
          </div>
        </div>

        <div class="card card_type_modal" v-if="vuexModalType === 'edit'">
          <h2 class="heading heading_size_sm margin-bottom_size_md">
            Change the text of the selected TODO
          </h2>
          <input
            class="input"
            type="text"
            v-model="todosLink[todoTempIndex].text"
          />
          <div class="controls controls_flex_right margin-bottom_remove">
            <button
              class="button button_color_error"
              @click="toggleModalEdit(false, -1)"
            >
              Cancel
            </button>
            <button
              class="button"
              @click="editTodo()"
              :disabled="isEditNotValid"
            >
              Done
            </button>
          </div>
        </div>

        <div class="card card_type_modal" v-if="vuexModalType === 'delete'">
          <h2 class="heading heading_size_sm margin-bottom_size_lg">
            Do you confirm that you want to delete this TODO?
          </h2>
          <div class="controls controls_flex_right margin-bottom_remove">
            <button
              class="button button_color_error"
              @click="toggleModalDelete(false, -1)"
            >
              Cancel
            </button>
            <button class="button" @click="deleteTodo()">
              Confirm
            </button>
          </div>
        </div>

        <div class="card card_type_modal" v-if="vuexModalType === 'back'">
          <h2 class="heading heading_size_sm margin-bottom_size_lg">
            Do you want to go back without saving?
          </h2>
          <div class="controls controls_flex_right margin-bottom_remove">
            <button
              class="button button_color_error"
              @click="vuexToggleModalVisibility(false)"
            >
              No
            </button>
            <button class="button" @click="vuexSetEditNoteById('')">
              Yes
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
  name: "Todos",
  data: () => ({
    todosLink: [],
    todoTempIndex: -1,
    todoTempText: "",
    historyState: "",
    undo: [],
    redo: [],
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
      return this.todoTempText === "";
    },

    isEditNotValid: function() {
      if (this.todosLink.length === 0 || this.todoTempIndex === -1) {
        return true;
      }

      return (
        this.todosLink[this.todoTempIndex].text === this.todoTempText ||
        this.todosLink[this.todoTempIndex].text === ""
      );
    },
  },
  methods: {
    ...mapMutations([
      "vuexToggleModalVisibility",
      "vuexSetModalType",
      "vuexGetNotes",
      "vuexSetEditNoteById",
      "vuexPutTodos",
      "vuexToggleLoadingState",
    ]),

    // GO BACK HANDLER
    goBack() {
      if (this.historyState === "") {
        this.vuexSetEditNoteById("");
      } else {
        this.vuexSetModalType("back");
        this.vuexToggleModalVisibility(true);
      }
    },

    // RESET CURRENT STATES
    resetCurrentStates() {
      this.todosLink = [];
      this.todoTempIndex = -1;
      this.todoTempText = "";
      this.historyState = "";
      this.undo = [];
      this.redo = [];
    },

    // PUSH CHANGES TO DB
    pushChanges() {
      this.vuexToggleLoadingState(true);

      axios({
        method: "put",
        url: this.vuexRestUrl,
        headers: {
          Authorization: `Basic ${this.vuexCredentials}`,
        },
        data: {
          id: this.vuexEditNoteId,
          todos: JSON.stringify(this.vuexNotes.todos),
        },
      })
        .then((response) => {
          this.resetCurrentStates();
          this.getSingleNote();
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

    // GET SINGLE NOTE
    getSingleNote() {
      this.vuexToggleLoadingState(true);
      axios({
        method: "get",
        url: `${this.vuexRestUrl}${this.vuexEditNoteId}`,
        headers: {
          Authorization: `Basic ${this.vuexCredentials}`,
        },
      })
        .then((response) => {
          this.vuexGetNotes(response.data);
          if (this.vuexNotes.todos !== "") {
            this.vuexPutTodos(JSON.parse(this.vuexNotes.todos));
            this.todosLink = this.vuexNotes.todos;
          }
          if (this.vuexIsModalVisible) {
            this.vuexToggleModalVisibility(false);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 404) {
              this.vuexGetNotes({});
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

    // ADD TODO
    toggleModalAdd(isVisible) {
      this.vuexSetModalType("add");
      this.todoTempText = "";
      this.vuexToggleModalVisibility(isVisible);
    },

    addTodo() {
      this.setUndo();

      this.todosLink.push({ text: this.todoTempText, checked: false });
      this.vuexPutTodos(this.todosLink);
      this.vuexToggleModalVisibility(false);
    },

    // EDIT TODO
    toggleModalEdit(isVisible, todoIndex) {
      if (isVisible || todoIndex > -1) {
        this.vuexSetModalType("edit");
        this.todoTempIndex = todoIndex;
        this.todoTempText = this.todosLink[this.todoTempIndex].text;
      } else {
        this.todosLink[this.todoTempIndex].text = this.todoTempText;
      }

      this.vuexToggleModalVisibility(isVisible);
    },

    editTodo() {
      this.setUndo();
      this.undo[this.todoTempIndex].text = this.todoTempText;

      this.todoTempText = this.todosLink[this.todoTempIndex].text;
      this.vuexToggleModalVisibility(false);
    },

    // DELETE TODO
    toggleModalDelete(isVisible, todoIndex) {
      this.vuexSetModalType("delete");
      if (todoIndex > -1) {
        this.todoTempIndex = todoIndex;
      }

      this.vuexToggleModalVisibility(isVisible);
    },

    deleteTodo() {
      this.setUndo();

      this.todosLink.splice(this.todoTempIndex, 1);

      if (this.todosLink.length <= 0) {
        this.vuexPutTodos("");
      }

      this.vuexToggleModalVisibility(false);
    },

    // UNDO
    setUndo() {
      this.historyState = "undo";

      this.undo = [];
      this.todosLink.forEach((todo) => {
        this.undo.push({ text: todo.text, checked: todo.checked });
      });
    },

    makeUndo() {
      this.setRedo();

      this.vuexPutTodos(this.undo);
      this.todosLink = this.vuexNotes.todos;
    },

    // REDO
    setRedo() {
      this.historyState = "redo";

      this.redo = [];
      this.todosLink.forEach((todo) => {
        this.redo.push({ text: todo.text, checked: todo.checked });
      });
    },

    makeRedo() {
      this.setUndo();

      this.vuexPutTodos(this.redo);
      this.todosLink = this.vuexNotes.todos;
    },
  },
  mounted() {
    this.getSingleNote();
  },
};
</script>

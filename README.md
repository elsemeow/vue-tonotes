# Tonotes Vue

_SPA for TODOs and notes_

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

# Configuration

Set path to Tonotes API in `src/store/index.js` (state `vuexRestUrl`).

# Components

## Auth

This component asks for a username and password and saves it until the page is reloaded in the vuex store if the API has confirmed the access right.

On the page, the application asks you to enter your username and password in the username and password input fields. To check the entered data, you need to click on the "LOG IN" button, if the data is correct, the Notes component will be displayed, if not, an error message will be displayed at the bottom of the form.

## Notes

This component allows you to work with notes (view, edit, delete).

Actions on the page:

- `ADD NEW NOTE` — add new note;
- `DELETE` — delete selected note;
- `RENAME` — rename selected note;
- `EDIT` — edit TODO list for selected note (go to Todos).

## Todos

This component allows you to edit the TODO list for the selected note. All changes are not sent to the database until the user clicks the SAVE button.

The user can undo and redo the last change made.

Actions on the page:

- `Clicking the checkbox` - toggle status (done / not done);
- `ADD NEW TODO` - add new TODO;
- `DELETE` - delete selected TODO;
- `EDIT` - change selected TODO;
- `UNDO` - undo last change;
- `REDO` - redo last change;
- `SAVE` - save changes to database;
- `BACK` - back to notes list.

# Styles

For styling, I created a unified set of selectors in the file `src / App.vue`.

# Used tools

- VSCodium;
- Vue js, Vue UI, Vuex;
- Axios;
- Google Fonts;
- favicon io.

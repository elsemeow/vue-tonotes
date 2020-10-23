<template>
  <div id="app">
    <Auth class="animation-opacity" v-if="!vuexIsUserAuthenticated" />
    <main class="container_type_main" v-if="vuexIsUserAuthenticated">
      <header class="header">
        <h1 class="heading heading_size_lg">
          <span class="logo-pattern">To</span>notes
        </h1>
      </header>
      <Notes class="animation-opacity" v-if="!vuexEditNoteId" />
      <Todos class="animation-opacity" v-if="vuexEditNoteId" />
      <transition name="animation-fade">
        <div class="modal modal_type_loader" v-if="vuexIsLoading">
          <div class="loader"></div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Auth from "./components/Auth.vue";
import Notes from "./components/Notes.vue";
import Todos from "./components/Todos.vue";

export default {
  name: "App",
  components: {
    Auth,
    Notes,
    Todos,
  },
  computed: {
    ...mapState(["vuexIsUserAuthenticated", "vuexEditNoteId", "vuexIsLoading"]),
  },
};
</script>

<style lang="scss">
// VARIABLES
$color_background: #121212;
$color_card: #1e1e1e;
$color_modal: rgba(0, 0, 0, 0.67);

$color_primary: #ffc77d;
$color_primary-transparent: rgba(255, 199, 125, 0.2);

$color_error: #cf6679;
$color_error-transparent: rgba(207, 102, 121, 0.2);

$color_low-contrast: rgba(255, 255, 255, 0.38);
$color_select: #fff2df;

$color_text: rgba(255, 255, 255, 0.87);
$color_text_faded: rgba(255, 255, 255, 0.6);

$shadow_card: 0px 1px 3px rgba(0, 0, 0, 0.2), 0px 2px 1px rgba(0, 0, 0, 0.12),
  0px 1px 1px rgba(0, 0, 0, 0.14);

$font_primary: "Roboto", sans-serif;

// FONTS
@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local("Roboto"), local("Roboto-Regular"),
    url(/fonts/Roboto/Roboto-Regular.ttf);
}

@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: local("Roboto Medium"), local("Roboto-Medium"),
    url(/fonts/Roboto/Roboto-Medium.ttf);
}

// RESET
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

/**
 * Extract from normalize.css
 * by Nicolas Gallagher and Jonathan Neal
 * git.io/normalize
 */
html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
main,
menu,
nav,
section,
summary {
  display: block;
}

audio,
canvas,
progress,
video {
  display: inline-block;
}

progress {
  vertical-align: baseline;
}

audio:not([controls]) {
  display: none;
  height: 0;
}

[hidden],
template {
  display: none;
}

a {
  background-color: transparent;
  -webkit-text-decoration-skip: objects;
}

a:active,
a:hover {
  outline-width: 0;
}

abbr[title] {
  border-bottom: none;
  text-decoration: underline;
  text-decoration: underline dotted;
}

dfn {
  font-style: italic;
}

mark {
  background: #ff0;
  color: #000;
}

small {
  font-size: 80%;
}

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

figure {
  margin: 1em 40px;
}

img {
  border-style: none;
}

svg:not(:root) {
  overflow: hidden;
}

code,
kbd,
pre,
samp {
  font-family: monospace;
  font-size: 1em;
}

hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

button,
input,
select,
textarea {
  font: inherit;
  margin: 0;
}

optgroup {
  font-weight: bold;
}

button,
input {
  overflow: visible;
}

button,
select {
  text-transform: none;
}

button,
html [type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

fieldset {
  border: 1px solid #c0c0c0;
  margin: 0 2px;
  padding: 0.35em 0.625em 0.75em;
}

legend {
  color: inherit;
  display: table;
  max-width: 100%;
  padding: 0;
  white-space: normal;
}

textarea {
  overflow: auto;
}

[type="checkbox"],
[type="radio"] {
  padding: 0;
}

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

[type="search"] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}

[type="search"]::-webkit-search-cancel-button,
[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

::-webkit-input-placeholder {
  color: inherit;
  opacity: 0.54;
}

::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}
// End extract

// BASE
::selection {
  background: $color_select;
  color: #000;
  text-shadow: none;
}

body {
  margin: 0;
  font-family: $font_primary;
  font-weight: 400;
  font-size: 14px;
  line-height: 143%;
  letter-spacing: 0.25px;
  color: $color_text_faded;
  background-color: $color_background;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// GRIDS
.grid {
  list-style: none;
  margin: 0;
  margin-left: -18px;
  margin-top: -18px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;

  & > * {
    box-sizing: border-box;
    margin: 0;
    margin-top: 18px;
    padding-left: 18px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  @media (min-width: 640px) {
    & > * {
      width: 50%;
    }
  }

  @media (min-width: 960px) {
    & > * {
      width: calc(100% * 1 / 3.001);
    }
  }
}

// CARD
.card {
  padding: 28px;
  width: 100%;
  background: $color_card;
  box-shadow: $shadow_card;
  border-radius: 4px;
  overflow: hidden;
}

.card_type_auth {
  max-width: 375px;
  margin: 0 auto;
}

.card_type_modal {
  max-width: 640px;
  margin: 0 auto;
}

.card_flex_vertical {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card__flex-1 {
  flex: 1;
}

// CONTROLS
.controls {
  display: flex;
  flex-wrap: wrap;
  margin: 18px 0;
}

.controls_flex_right {
  justify-content: flex-end;
}

// CONTAINERS
.header {
  margin: -24px -8px 0;
  padding: 24px;
  background-color: $color_card;
  box-shadow: $shadow_card;
  border-radius: 0 0 4px 4px;
}

.container_type_main {
  padding: 24px 8px;
  width: 100vw;
  height: 100vh;
  overflow: auto;
}

.container_type_max-width {
  margin: 0 auto;
  max-width: 1280px;
}

.container_type_auth {
  padding: 52px 8px 24px;
  width: 100vw;
  height: 100vh;
  overflow: auto;
}

// TYPOGRAPHY
.paragraph {
  margin: 0;
}

.paragraph_type_small {
  color: $color_low-contrast;
  font-size: 14px;
  line-height: 180%;
}

.paragraph_type_error {
  text-align: center;
  color: $color_error;
}

.label {
  display: inline-block;
  margin-bottom: 8px;
}

.heading {
  margin: 0;
  font-weight: 500;
  font-size: 20px;
  line-height: 120%;
  letter-spacing: 0.15px;
  color: $color_text;
}

.heading_size_lg {
  font-size: 32px;
}

.heading_size_sm {
  font-size: 20px;
}

.align_center {
  text-align: center;
}

.logo-pattern {
  display: inline-block;
  margin-right: 2px;
  padding: 0 4px;
  background-color: $color_primary;
  color: $color_card;
  border-radius: 4px;
}

// MARGINS
.margin-horizontal {
  margin-left: 20px;
  margin-right: 20px;
}

.margin-bottom_size_sm {
  margin-bottom: 8px;
}

.margin-bottom_size_md {
  margin-bottom: 24px;
}

.margin-bottom_size_lg {
  margin-bottom: 32px;
}

.margin-bottom_remove {
  margin-bottom: 0;
}

.margin-top_size_sm {
  margin-top: 8px;
}

.margin-top_size_md {
  margin-top: 24px;
}

.margin-top_size_lg {
  margin-top: 32px;
}

.margin-top_remove {
  margin-top: 0;
}

// INPUTS
.input {
  display: block;
  margin: 0;
  padding: 0 16px;
  width: 100%;
  height: 54px;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.15px;
  border: none;
  border-radius: 4px 4px 0 0;
  background-color: $color_background;
  border-bottom: 2px solid $color_low-contrast;
  color: $color_text;
  transition: 0.1s ease-in-out;
  transition-property: color, border-color;

  &:focus {
    outline: none;
    color: #fff;
    border-color: $color_primary;
  }

  &:disabled {
    border: none;
    border-radius: 4px;
    cursor: not-allowed;
  }
}

.checkbox__container {
  display: flex;
  align-items: flex-start;
  margin-bottom: 18px;
  padding-top: 24px;
  border-top: 1px solid $color_low-contrast;
}

.checkbox__container_type_todo {
  border-top: none;
}

.checkbox__child {
  &:first-child {
    & .checkbox__container {
      border-top: none;
    }
  }
}

.checkbox {
  display: inline-block;
  height: 24px;
  width: 24px;
  min-width: 24px;
  overflow: hidden;
  margin-top: -5px;
  vertical-align: middle;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: 2px solid $color_low-contrast;
  border-radius: 4px;
  transition: 0.2s ease-in-out;
  transition-property: background-color, border;
  cursor: not-allowed;

  &:checked {
    background-color: $color_primary-transparent;
    border-color: transparent;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2214%22%20height%3D%2211%22%20viewBox%3D%220%200%2014%2011%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%3Cpolygon%20fill%3D%22%23fff%22%20points%3D%2212%201%205%207.5%202%205%201%205.5%205%2010%2013%201.5%22%20%2F%3E%0A%3C%2Fsvg%3E%0A");
  }

  &:focus {
    outline: none;
  }

  &:focus:not(:disabled),
  &:hover:not(:disabled) {
    border-color: #fff;
    cursor: pointer;
  }

  &:focus:checked:not(:disabled),
  &:hover:checked:not(:disabled) {
    border-color: #fff;
  }

  &:checked + .checkbox__text {
    text-decoration: line-through;
    color: $color_low-contrast;
  }
}

.checkbox__text {
  display: block;
  margin-left: 12px;
  line-height: 130%;
  letter-spacing: 0.15px;
  color: $color_text;
  transition: 0.2s ease-in-out;
  transition-property: color;
}

.checkbox__text_ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// BUTTONS
.button {
  display: block;
  margin: 0;
  padding: 0 20px;
  width: auto;
  height: 54px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 1.25px;
  white-space: nowrap;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: $color_primary;
  transition: 0.1s ease-in-out;
  transition-property: color, background-color, transform;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:hover,
  &:focus {
    background-color: $color_primary-transparent;
  }

  &:active {
    box-shadow: none;
    transform: scale(0.9);
  }

  &.button_color_error {
    color: $color_error;

    &:hover,
    &:focus {
      background-color: $color_error-transparent;
    }
  }

  &:disabled {
    color: $color_low-contrast;
    background-color: transparent;
    cursor: not-allowed;
  }
}

// MODAL
.modal {
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: $color_modal;
  padding: 52px 8px 24px;
  overflow: auto;
}

.modal_type_loader {
  top: 90px;
  height: calc(100vh - 90px);
  background-color: $color_background;
  display: flex;
  align-items: center;
  justify-content: center;
}

// LOADER
.loader {
  border: 8px solid $color_card;
  border-top: 8px solid $color_primary;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  animation: animation_spin 2s linear infinite;
}

// ANIMATIONS
.animation-zoom-enter-active {
  animation: animation_zoom 0.4s ease-in-out;
}

.animation-zoom-leave-active {
  animation: animation_zoom 0.4s ease-in-out reverse;
}

@keyframes animation_zoom {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animation-fade-enter-active {
  animation: animation_fade 0.3s ease-in-out;
}

.animation-fade-leave-active {
  animation: animation_fade 0.3s ease-in-out reverse;
}

@keyframes animation_fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes animation_spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animation-opacity {
  animation: animation_opacity 0.3s ease-in-out;
}

@keyframes animation_opacity {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// UTILITY
.reverse {
  display: flex;
  flex-direction: column-reverse;
}
</style>

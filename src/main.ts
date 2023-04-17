import { createApp } from 'vue'
import App from './App.vue'

import * as FaIcons from "oh-vue-icons/icons/fa";
import { OhVueIcon, addIcons } from "oh-vue-icons";

const Fa = Object.values({ ...FaIcons });

addIcons(...Fa);

const app = createApp(App)

app.component("v-icon", OhVueIcon);

app.mount('#app')

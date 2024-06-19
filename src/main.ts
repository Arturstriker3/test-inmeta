import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { createVuestic } from "vuestic-ui";
import 'vuestic-ui/styles/essential.css';
import 'vuestic-ui/styles/typography.css';
import { createPinia } from 'pinia';
import router from './core/router/pages'

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(router);

app.use(createVuestic());

app.mount("#app");

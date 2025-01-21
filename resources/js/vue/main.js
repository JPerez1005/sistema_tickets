import { createApp } from "vue";
import App  from './App.vue';
import axios from "axios";
import router from './router.js';
import '../../css/vue.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createPinia } from 'pinia';

const app=createApp(App);
const pinia = createPinia();
app.use(router).use(pinia);

app.config.globalProperties.$axios = axios;
window.axios=axios;

app.mount("#app");
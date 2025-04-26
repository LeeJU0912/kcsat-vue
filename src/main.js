import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import i18n from './plugins/i18n.js';
import api from './services/api.js';
import './assets/style.css';

import 'bootstrap/dist/css/bootstrap.min.css'


const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

app.use(pinia);
app.use(i18n);
app.use(router);

// Axios 인스턴스를 전역 속성으로 설정
app.config.globalProperties.$api = api;

app.mount('#app')
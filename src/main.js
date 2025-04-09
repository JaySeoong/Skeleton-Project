import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
//이재성 부트스트랩 import 추가
import 'bootstrap/dist/css/bootstrap.min.css';
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');

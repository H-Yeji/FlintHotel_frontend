import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router/index.js';
import vuetify from '@/plugins/vuetify';
import 'vuetify/styles'; // Vuetify의 CSS를 로드합니다.
import VCalendar from 'v-calendar'; // v-calendar
import 'v-calendar/style.css'; // VCalendar의 CSS를 로드합니다.
import store from './store/index'; // 상태관리 (전역변수)
import VueDatePicker from '@vuepic/vue-datepicker'; // VueDatePicker 컴포넌트
import '@vuepic/vue-datepicker/dist/main.css'; // VueDatePicker의 CSS를 로드합니다.

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(VCalendar); // VCalendar 플러그인 사용
app.use(store);

// VueDatePicker 컴포넌트 등록
app.component('VueDatePicker', VueDatePicker);

app.mount('#app');

instance.interceptors.request.use(
    config => {
      let token = localStorage.getItem('employeetoken') || localStorage.getItem('membertoken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
  
  instance.interceptors.response.use(
      response => response,
      async error => {
          if(error.response && error.response.status === 401){
            if(localStorage.getItem('employeetoken')!=null){
                localStorage.removeItem('employeetoken')
            } else if(localStorage.getItem('membertoken')!=null){
                localStorage.removeItem('membertoken')
            } else{
                console.log('로그인하세요')
            }
          }
          return Promise.reject(error)
    }
  )
  
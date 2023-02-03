import Vue from 'vue';
// import 'vant/lib/index.css';
import Dev from './serve.vue';


Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Dev),
}).$mount('#app');

import "@babel/polyfill";
import "./index.scss";

import Vue from 'vue';
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

import App from './app/App.vue';

Vue.use(VueMaterial)

new Vue({
  el: '#app',
  components: { App },
  render: (h) => {
  	return h(App);
  }
});

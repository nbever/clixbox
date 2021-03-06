import "@babel/polyfill";
import "./index.scss";

import Vue from 'vue';
import VueMaterial from 'vue-material';
import VueRouter from 'vue-router';
import 'vue-material/dist/vue-material.min.css';
import VTooltip from 'v-tooltip';

import ClixApi from './app/clixService.js';

import App from './app/App.vue';
import Home from './app/Home.vue';
import ClixBox from './app/clixbox/ClixBox';
import EditClix from './app/clixbox/EditClix';
import CreateEditClix from './app/clixbox/CreateEditClix';
import GameBox from './app/gamebox/GameBox';
import CreateGame from './app/gamebox/CreateGame';
import GameSetup from './app/gamebox/GameSetup';
import GameView from './app/game/GameView';

Vue.use(VueMaterial);
Vue.use(VTooltip);
Vue.use(VueRouter);
Vue.use(ClixApi);

const router = new VueRouter({
  routes: [
    {path: '/home', name: 'home', component: Home},
    {path: '/clixbox', name: 'clixbox', component: ClixBox},
    {path: '/gamebox', name: 'gamebox', component: GameBox},
    {path: '/clixbox/create', name: 'create', component: CreateEditClix},
    {path: '/clixbox/edit/:clixId', name: 'edit', component: EditClix, props: true},
    {path: '/', redirect: {name: 'home'}},
    {path: '/gamebox/create', name: 'gamebox_create', component: CreateGame},
    {path: '/game/:gameId', name:'game', component: GameView, props: (route) => {
      return {
        ...route.query,
        gameId: decodeURIComponent(route.params.gameId)
      };
    }},
    {path: '/gamebox/setup', component: GameSetup, props: (route) => {
      return {
        ...route.query, 
        cost: parseInt(route.query.cost),
        players: JSON.parse(decodeURIComponent(route.query.players))
      }
    }}
    // {path: '/foo', component: Foo},
    // {path: '/home', name: 'leagues', component: Leagues},
    // {path: '/admin', component: Admin, props: true,
    //   children: [
    //     {path: 'leagues', name: 'leagueAdmin', component: LeagueAdmin},
    //     {path: 'cardsets', component: CardSets, props: true,
    //       children: [
    //         {path: 'create', name: "create-card-set", component: CreateCardSet},
    //         {path: 'view/:cardSetId', name: 'view-cardset', component: ViewCardSet},
    //         {path: 'view/:cardSetId/addteam', component: CreateTeam},
    //         {path: '/', name: 'card-list', component: CardSetsList}
    //       ]
    //     },
    //     {path: '/', redirect: 'leagues'}
    //   ]},
    // {path: '*', redirect: {name: 'leagues'}}
  ]
}) ;

new Vue({
  el: '#app',
  components: { App },
  render: (h) => {
  	return h(App);
  },
  router,
  data: {
    error: null,
    showError: false,
    loading: false
  },
  methods: {
    setError: function(err) {
      this.error = err;
      this.showError = true;
    },
    setLoading: function(load) {
      this.loading = load;
    }
  }
});

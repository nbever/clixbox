
import isFunction from 'lodash/isFunction';
import {clixFetch} from './ClixFetch';

import isNil from 'lodash/isNil';

let enhancements = null;
let abilities = null;
let keywords = null;

const listToObject = function(list) {
  return list.reduce((val, el) => {
    val[el._id] = el;
    return val;
  }, {});
};

const genericLoader = async function(url, $root) {
  const list = await clixFetch(
    $root,
    url,
    'GET'
  );
  
  return listToObject(list);
};

const ClixApi = {
  install: (Vue, options) => {
    Vue.mixin({
      methods: {
        getEnhancements: async function() {
          if (isNil(enhancements)) {
            enhancements = await genericLoader(
              '/api/enhancements', this.$root);
          }

          return enhancements;
        },
        getEnhancement: async function(id) {
          const enhancements = await this.getEnhancements();
          return enhancements[id];
        },
        getEnhancementByName: async function(name) {
          const enhancements = await this.getEnhancements();
          return Object.values(enhancements).find((e) => {
            return e.type === name;
          });
        },
        getAbilities: async function() {
          if (isNil(abilities)) {
            abilities = await genericLoader(
              '/api/abilities', this.$root);
          }

          return abilities;
        },
        getAbility: async function(id) {
          const abilities = await this.getAbilities();
          return abilities[id];          
        },
        getAbilityByAction: async function(action) {
          const abilities = await this.getAbilities();
          return Object.values(abilities).find((a) => {
            return a.action === action;
          });
        },
        getKeywords: async function() {
          if (isNil(keywords)) {
            keywords = await genericLoader(
              '/api/keywords', this.$root);
          }

          return keywords;
        },
        getKeyword: async function(id) {
          const keywords = await this.getKeywords();
          return keywords[id];
        },
        getKeywordByName: async function(name) {
          const keywords = await this.getKeywords();
          return Object.values(keywords).find((k) => {
            return k.term === name;
          });
        },
        getAllClix: async function() {
          const clix = await genericLoader(
            '/api/clix', this.$root);
          return clix;
        },
        getClix: async function(id) {
          const clix = await clixFetch(this.$root, `/api/clix/${id}`, 'GET');
          return clix;
        },
        saveClix: async function(clix, callback) {
          const savedClix = await clixFetch(
            this.$root, '/api/clix', 'POST', clix);

          callback(savedClix);
        },
        updateClix: async function(clix, id, callback) {
          const savedClix = await clixFetch(
            this.$root, `/api/clix/${id}`, 'PUT', clix);

          callback(savedClix);
        },
        deleteClix: async function(id) {
          await clixFetch(this.$root, `/api/clix/${id}`, 'DELETE');
          return;
        },
        saveImage: async function(image, callback) {
          const formData = new FormData();
          formData.append('picUpload', image);

          const response = await fetch(
            '/api/images', 
            {
              method: 'POST', 
              body: formData
            }
          );

          const result = await response.json();
          return result.logo;
        },
        deleteImage: async function(imageName) {
          await clixFetch(this.$root, '/api/images/' + imageName, 'DELETE');
        },
        getGames: async function() {
          const games = await genericLoader('/api/games', this.$root);
          return games;
        },
        getGame: async function(gameId) {
          const game = await clixFetch(this.$root, `/api/game/${gameId}`, 'GET');
          return game;
        },
        createGame: async function(game) {
          const newGame = await clixFetch(this.$root, '/api/game', 'POST', game);
          return newGame;
        },
        updateGame: async function(game, id) {
          const savedGame = await clixFetch(this.$root, `/api/game/${id}`, 'PUT', game);
          return savedGame;
        },
        deleteGame: async function(gameId) {
          await clixFetch(this.$root, `/api/game/${gameId}`, 'DELETE');
        }
      }
    });
  }
};

export default ClixApi;
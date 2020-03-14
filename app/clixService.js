
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
        getAbility: async function(id) {
          if (isNil(abilities)) {
            abilities = await genericLoader(
              '/api/abilities', this.$root);
          }

          return abilities[id];          
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
        }
      }
    });
  }
};

export default ClixApi;
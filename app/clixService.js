
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
        getEnhancement: async function(id) {
          if (isNil(enhancements)) {
            enhancements = await genericLoader(
              '/api/enhancements', this.$root);
          }

          return enhancements[id];
        },
        getAbility: async function(id) {
          if (isNil(abilities)) {
            abilities = await genericLoader(
              '/api/abilities', this.$root);
          }

          return abilities[id];          
        },
        getKeyword: async function(id) {
          if (isNil(keywords)) {
            keywords = await genericLoader(
              '/api/keywords', this.$root);
          }

          return keywords[id];
        }
      }
    });
  }
};

export default ClixApi;
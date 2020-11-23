<template>
  <div class="clix-card flex column" :style="koStyle">
    <div class="name stiff">{{clix.name}}</div>

    <div class="container flex row grow">

      <div class="image-box flex column">
        <div class="image grow" :style="{backgroundImage: `url(/images/${clix.image})`}">
        </div>
        <clicker 
          :click="currentClick"
          :clickIndex="clixStatus.onClick"
          :range="clix.range"
          :badges="badges"
          :takeDamage="takeDamage"
          :heal="heal"
          :abilities="abilities"
        >
        </clicker>
        <div class="actions grow">
          <div class="bold">Action Tokens</div>
          <div class="flex row">
            <div 
              v-for="token in clixStatus.actionTokens"
              class="token"
            >
            </div>
          </div>
          <div class="action-buttons">
            <md-button @click="addToken" class="md-icon-button">
              <md-icon class="mycons mycons-plus"></md-icon>
            </md-button>
            <md-button @click="clearTokens" class="md-icon-button">
              <md-icon class="mycons mycons-cancel-circle"></md-icon>
            </md-button>
          </div>
        </div>
      </div>

      <div class="stat-box grow">
        <div class="stat flex row" v-for="key in badgeKeys"
          v-if="key !== 'ALL' || isPresent(key)"
        >
          <div class="action-badge">
            <md-icon :class="`hc ${getBadgeClass(key)}`">
            </md-icon>
          </div>
          <div v-if="isPresent(key)" class="flex row">
            <div class="orb stiff" :style="getAbilityStyle(key)">
            </div>
            <div class="grow">
              <div>{{getAbilityText(key)}}</div>
              <div 
                v-if="hasIt(key, 'extraAbilities')"
                
              >
                <div class="bold">Extra Abilities:</div>
                <div v-for="extraAbility in extraAbilities[key.toLowerCase()]">
                  {{extraAbility.text}}
                </div>
              </div>

              <div
                v-if="hasIt(key, 'enhancements')"
              >
                <div class="bold">Enhancements:</div>
                <div 
                  v-for="enhancement in enhancements[key.toLowerCase()]"
                  class="flex row"
                >
                  <div class="orb" :style="{backgroundColor: enhancement.color}">
                  </div>
                  <div>{{enhancement.text}}</div>
                </div>
              </div>

              <div
                v-if="hasIt(key, 'keywords')"
              >
                <div class="bold">Keywords</div>
                <div 
                  v-for="keyword in keywords[key.toLowerCase()]"
                  class="flex row"
                >
                  <div class="pad-right">{{keyword.term}}:</div>
                  <div>{{keyword.text}}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="specials grow" v-if="hasSpecials">
        <div class="enhancements" v-if="hasGlobalEnhancements">
          <div class="bold">
            Enhancements
          </div>
          <div
            v-for="enhancement in globalEnhancements"
            class="flex row"
          >
            <div class="orb" :style="{backgroundColor: enhancement.color}">
            </div>
            <div>{{enhancement.text}}</div>
          </div>
        </div>
        <div class="keywords" v-if="hasGlobalKeywords">
          <div class="bold">Keywords</div>
          <div v-for="keyword in globalKeywords"
            class="flex row"
          >
            <div class="pad-right">{{keyword.term}}:</div>
            <div>{{keyword.text}}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import isNil from 'lodash/isNil';
  import Clicker from './Clicker';
  import {getBadge} from '../clixbox/resolvers';
  import {MOVE, ATTACK, DAMAGE, DEFEND, SPEED, DEFENSE, ALL} from '../../constants';

  export default {
    name: 'clix-card',
    props: {
      clix: Object,
      clixStatus: Object,
      takeDamage: Function,
      heal: Function,
      addToken: Function,
      clearTokens: Function
    },
    components: {
      Clicker
    },
    data: function() {
      return {
        badges: {},
        badgeKeys: [MOVE, ATTACK, DAMAGE, DEFEND, ALL],
        abilities: {},
        extraAbilities: {},
        enhancements: {},
        keywords: {},
        globalEnhancements: [],
        globalKeywords: []
      };
    },
    computed: {
      currentClick: function() {
        return this.clix.clix[this.clixStatus.onClick - 1];
      },
      hasSpecials: function() {
        return this.hasGlobalKeywords || this.hasGlobalEnhancements;
      },
      hasGlobalEnhancements: function() {
        return !isNil(this.globalEnhancements) && this.globalEnhancements.length > 0;
      },
      hasGlobalKeywords: function() {
        return !isNil(this.globalKeywords) && this.globalKeywords.length > 0;
      },
      koStyle: function() {
        return this.clixStatus.knockedOut ?
          {opacity: 0.7} : {};
      }
    },
    watch: {
      currentClick: function(click) {
        this.fixAbilities(click);
        this.fixExtras();
      }
    },
    methods: {
      fixGlobals: function() {

        const doIt = async () => {
          const gEnhancements = await Promise.all(this.clix.enhancements.map(async (e) => {
            const en = await this.getEnhancement(e);
            return en;
          }));

          const gKeywords = await Promise.all(this.clix.keywords.map(async (k) => {
            const ky = await this.getKeyword(k.keyword);
            return ky;
          }));

          this.globalKeywords = gKeywords;
          this.globalEnhancements = gEnhancements;
        };

        doIt();
      },
      fixExtras: function() {
        const doIt = async () => {

          const getCustomElements = function(datakey) {
            return this.getAllConstantCustomAbilities()
              .reduce((list, ca) => {
                const newList = list.concat(ca[datakey]);
                return newList;
              }, []);
          };

          Object.keys(this.abilities).forEach( async (key) => {
            const rawExtraAbilities = key === ALL ?
              getCustomElements('abilities')
              :
              this.abilities[key].abilities;

            const rawEnhancements = key === ALL ?
              getCustomElements('enhancements')
              :
              this.abilities[key].enhancements;

            const rawKeywords = key === ALL ?
              getCustomElements('keywords')
              :
              this.abilities[key].keywords;

            if (!isNil(rawExtraAbilities)) {
              const extraAbilities = key === ALL ?
                rawExtraAbilities
                :
                await Promise.all(rawExtraAbilities.map( async (re) => {
                  const realAbility = await this.getAbilityByAction(re.action);
                  return realAbility;
                }));

              this.$set(this.extraAbilities, key, extraAbilities);
            }

            if (!isNil(rawEnhancements)) {
              const enhancements = key === ALL ?
                rawEnhancements
                :
                await Promise.all(rawEnhancements.map( async (re) => {
                  const realEnhancement = await this.getEnhancement(re);
                  return realEnhancement;
                }));

              this.$set(this.enhancements, key, enhancements);
            }

            if (!isNil(rawKeywords)) {
              const keywords = key === ALL ?
                rawKeywords
                :
                await Promise.all(rawKeywords.map( async (re) => {
                  const realKeyword = await this.getKeywordByName(re.keyword);
                  return realKeyword;
                }));

              this.$set(this.keywords, key, keywords);
            }
          });

          this.fixGlobals();
        };

        doIt();
      },
      fixAbilities: function(click) {
        const findIt = async () => {

          if (isNil(click)) {
            return;
          }

          const keys = Object.keys(click).filter((key) => {
            return key !== '_id' && key !== 'ordinal';
          });

          for (let i = 0; i < keys.length; i++) {
            const ability = await this.getAbility(click[keys[i]].ability);

            if (isNil(ability)) {
              continue;
            }

            if (ability.category === 'CUST') {
              const customAbility = this.clix.customAbilities.find((ca) => {
                return (ca.category === SPEED && keys[i] === 'move') ||
                  (ca.category === DEFENSE && keys[i] === 'defend') ||
                  ca.category.toLowerCase() === keys[i];
              });

              if (!isNil(customAbility)) {
                this.$set(this.abilities, keys[i], customAbility);
                continue;
              }
            }

            this.$set(this.abilities, keys[i], ability);
          }
        };

        findIt();
      },
      getBadgeClass: function(key) {
        return key === ALL ?
          'hc-icon-star'
          :
          isNil(this.badges[key]) ?
            ''
            :
            this.badges[key].iconClass;
      },
      isPresent: function(key) {

        if (key === ALL) {
          const allAbilities = this.getAllConstantCustomAbilities();
          return !isNil(allAbilities) && allAbilities.length > 0;
        }

        return !isNil(this.abilities) &&
          !isNil(this.abilities[key.toLowerCase()])
      },
      getAbilityText: function(key) {
        const lKey = key.toLowerCase();
        return key === ALL ?
          this.clix.customAbilities
            .filter((ca) => {
              return ca.category === ALL;
            })
            .map((all) => {
              return all.text;
            })
            .join(' - AND - ')
          :
          (isNil(this.abilities) || isNil(this.abilities[lKey])) ?
            ''
            :
            this.abilities[lKey].text;
      },
      getAbilityStyle: function(key) {
        const lKey = key.toLowerCase();
        return (isNil(this.abilities) || isNil(this.abilities[lKey])) ?
          {}
          :
          {backgroundColor: this.abilities[lKey].color};
      },
      getAllConstantCustomAbilities: function() {
        return this.clix.customAbilities.filter((ca) => {
          return ca.category === ALL;
        });
      },
      hasIt: function(hkey, datakey) {

        if (hkey === ALL) {
          const allAbilities = this.getAllConstantCustomAbilities();
          const matches = allAbilities.filter((a) => {
            return !isNil(a[datakey]) && a[datakey].length > 0;
          });

          return !isNil(matches) && matches.length > 0;
        }

        const things = this[datakey][hkey.toLowerCase()];
        return !isNil(things) && things.length > 0;
      }
    },
    mounted: function() {
      const doIt = async () => {
        for (let i = 0; i < this.badgeKeys.length; i++) {
          const key = this.badgeKeys[i];
          const badge = await getBadge(this.clix, key, this);
          this.$set(this.badges, key + '', badge);

          this.fixAbilities(this.currentClick)
          this.fixExtras();
        }
      }

      doIt();
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .clix-card {
    margin: 8px;
    padding: 8px;
    border: 1px solid $light-gray;
    border-radius: 6px;
    min-height: 340px
  }

  .image {
    width: 100%;
    min-height: 140px;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .image-box {
    width: 200px;
    min-height: 150px;
  }

  .stat-box {
    padding-left: 8px;
    max-width: 400px
  }

  .stat {
    padding: 8px;
  }

  .pad-right {
    padding-right: 4px;
  }

  .orb {
    width: 16px;
    height: 16px;
    border-radius: 10px;
    border: 1px solid $light-gray;
    margin-right: 4px;
  }

  .token {
    width: 48px;
    height: 48px;
    background-color: $blue;
    border-radius: 26px;
    border: 4px solid $middle-gray;
  }
</style>
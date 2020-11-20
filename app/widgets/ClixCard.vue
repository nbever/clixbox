<template>
  <div class="clix-card">
    <div class="name">{{clix.name}}</div>

    <div class="container flex row">

      <div class="image-box">
        <div class="image grow" :style="{backgroundImage: `url(/images/${clix.image})`}">
        </div>
        <clicker 
          :click="currentClick" 
          :badges="badges"
          :takeDamage="takeDamage"
          :heal="heal"
          :abilities="abilities"
        >
        </clicker>
      </div>

      <div class="stat-box grow">
        <div class="stat flex row" v-for="key in badgeKeys">
          <div class="action-badge">
            <md-icon :class="`hc ${getBadgeClass(key)}`"></md-icon>
          </div>
          <div v-if="isPresent(key)" class="flex row">
            <div class="orb stiff" :style="getAbilityStyle(key)">
            </div>
            <div class="grow">{{getAbilityText(key)}}</div>
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
  import {MOVE, ATTACK, DAMAGE, DEFEND, SPEED, DEFENSE} from '../../constants';

  export default {
    name: 'clix-card',
    props: {
      clix: Object,
      clixStatus: Object,
      takeDamage: Function,
      heal: Function
    },
    components: {
      Clicker
    },
    data: function() {
      return {
        badges: {},
        badgeKeys: [MOVE, ATTACK, DAMAGE, DEFEND],
        abilities: {}
      };
    },
    computed: {
      currentClick: function() {
        return this.clix.clix[this.clixStatus.onClick - 1];
      }
    },
    watch: {
      moveAbility: function(value) {
        alert(JSON.stringify(value));
      },
      currentClick: function(click) {
        this.fixAbilities(click);
      }
    },
    methods: {
      fixAbilities: function(click) {
        const findIt = async () => {
          const keys = Object.keys(click).filter((key) => {
            return key !== '_id' && key !== 'ordinal';
          });

          for (let i = 0; i < keys.length; i++) {
            const ability = await this.getAbility(click[keys[i]].ability);

            if (ability.category === 'CUST') {
              const customAbility = this.clix.customAbilities.find((ca) => {
                return (ca.category === SPEED && keys[i] === 'move') ||
                  (ca.category === DEFENSE && keys[i] === 'defend') ||
                  ca.category.toLowerCase() === keys[i];
              });

              if (!isNil(customAbility)) {
                ability.text = customAbility.text;
              }
            }

            this.$set(this.abilities, keys[i], ability);
          }
        };

        findIt();
      },
      getBadgeClass: function(key) {
        return isNil(this.badges[key]) ?
          ''
          :
          this.badges[key].iconClass;
      },
      isPresent: function(key) {
        return !isNil(this.abilities) &&
          !isNil(this.abilities[key.toLowerCase()])
      },
      getAbilityText: function(key) {
        const lKey = key.toLowerCase();
        return (isNil(this.abilities) || isNil(this.abilities[lKey])) ?
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
      }
    },
    mounted: function() {
      const doIt = async () => {
        for (let i = 0; i < this.badgeKeys.length; i++) {
          const key = this.badgeKeys[i];
          const badge = await getBadge(this.clix, key, this);
          this.$set(this.badges, key + '', badge);

          this.fixAbilities(this.currentClick)
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
    min-height: 290px
  }

  .image {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .image-box {
    width: 200px;
    height: 150px;
  }

  .stat-box {
    padding-left: 8px;
    max-width: 400px
  }

  .stat {
    padding: 8px;
  }

  .orb {
    width: 16px;
    height: 16px;
    border-radius: 10px;
    border: 1px solid $light-gray;
    margin-right: 4px;
  }
</style>
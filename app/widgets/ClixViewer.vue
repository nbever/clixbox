<template>
  <div class="padder" @mouseover="showButton = true" @mouseleave="showButton = false">
    <div class="clix-viewer small">
      <div class="name-span flex row">
        <div class="name">{{clix.name}}</div>
        <div class="cost"> - ({{clix.cost}})</div>
      </div>
      <div class="body-block flex row">
        <div class="image-width flex column">
          <div class="image grow" :style="{backgroundImage: `url(/images/${clix.image})`}">
          </div>
          <div class="stiff">{{clix.clix.length}} Clicks</div>
        </div>

        <div class="abilities">
          <div class="action-parent" v-for="key in abilityKeys">
            <div class="action flex row">
              <div class="action-badge">
                <md-icon :class="`hc ${getBadgeClass(key)}`"></md-icon>
              </div>
              <div class="ability-row flex row" v-for="ability in abilities[key]">
                <ability-badge :ability="ability" :customAbility="getCustomAbility(key)" :no-border="true">
                </ability-badge>
              </div>
            </div>
          </div>
          <div class="action-parent" v-if="alwaysAbilities.length > 0">
            <div class="action flex row">
              <div class="action-badge">
                <md-icon class="hc hc-icon-star"></md-icon>
              </div>
              <div class="ability-row flex row" v-for="customAbility in alwaysAbilities">
                <ability-badge :customAbility="customAbility" :no-border="true">
                </ability-badge>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <transition name="fade">
      <div class="pick-me" v-if="showButton">
        <md-button class="md-raised" @click="internalClickCallback">
          Pick Me!
        </md-button> 
      </div>
    </transition>

  </div>
</template>

<script>

import isNil from 'lodash/isNil';
import AbilityBadge from '../widgets/AbilityBadge';
import {getBadge} from '../clixbox/resolvers';
import {ATTACK, DAMAGE, DEFEND, MOVE, SPEED, ALL} from '../../constants';

export default {
  name: 'clix-viewer',
  components: {
    AbilityBadge
  },
  props: {
    clix: Object,
    highlight: Boolean,
    isSmall: Boolean,
    clickCallback: Function
  },
  data: function() {
    return {
      abilities: {},
      moveBadge: {iconClass: ''},
      defendBadge: {iconClass: ''},
      damageBadge: {iconClass: ''},
      attackBadge: {iconClass: ''},
      showButton: false
    };
  },
  computed: {
    abilityKeys: function() {
      return Object.keys(this.abilities);
    },
    alwaysAbilities: function() {
      return this.clix.customAbilities.filter((ca) => {
        return ca.category === ALL;
      });
    }
  },
  methods: {
    internalClickCallback: function() {
      this.clickCallback(this.clix);
    },
    getBadgeClass: function(key) {
      const badge = this[`${key}Badge`];

      return isNil(badge) ? '' : badge.iconClass;
    },
    getCustomAbility: function(key) {
      return this.clix.customAbilities.find((ca) => {
        return (ca.category.toLowerCase() === key ||
          (ca.category === SPEED && key === MOVE.toLowerCase()));
      });
    },
    refresh: function() {
      const doIt = async () => {
        const abilityList = this.clix.clix.reduce((abilities, clix) => {
          Object.keys(clix).filter((key) => {
            return (isNil(abilities[key]) || (!abilities[key].includes(clix[key].ability) && key !== '_id'));
          })
          .forEach((goodKey) => {

            if (isNil(clix[goodKey].ability)) {
              return;
            }

            if (isNil(abilities[goodKey])) {
              abilities[goodKey] = [];
            }

            abilities[goodKey].push(clix[goodKey].ability);
          });

          return abilities;
        }, {});

        Object.keys(abilityList)
          .filter((k) => {
            return k !== '_id' && k !== 'ordinal';
          })
          .forEach((aKey) => {
            const promises = abilityList[aKey].map(async (ability) => {
                const fullAbility = await this.getAbility(ability);
                return fullAbility;
              });

            Promise.all(promises).then((results) => {
              this.$set(this.abilities, aKey, results);
            });
          });

          this.attackBadge = await getBadge(this.clix, ATTACK, this);
          this.moveBadge = await getBadge(this.clix, MOVE, this);
          this.defendBadge = await getBadge(this.clix, DEFEND, this);
          this.damageBadge = await getBadge(this.clix, DAMAGE, this);
        };

      doIt();
    }
  },
  mounted: function () {
    this.refresh();
  }
};

</script>

<style lang="scss" scoped>
  @import '../../variables';

  .clix-viewer {
    border: 1px solid $light_gray;
    padding: 12px;
    border-radius: 6px;

    &:hover {
      background-color: $light_gray;
    }
  }

  .small {
    width: 275px;
    height: 180px;
  }

  .name {
    font-weight: 'bolder'
  }

  .cost {
    font-style: italic;
  }

  .image {
    width: 100%;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .image-width {
    width: 100px;
  }

  .abilities {
    padding-left: 4px;
  }

  .padder {
    padding: 8px;
    position: relative;
  }

  .action-badge {
    width: 40px;
    position: relative;
    top: 6px;
  }

  .pick-me {
    position: absolute;
    bottom: -20px;
    text-align: center;
    width: 100%;
    z-index: 2;
  }

  .fade-enter-active .fade-leave-active {
    transition: opactiy 200ms;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

</style>
<template>
  <div class="padder">
    <div class="clix-viewer small">
      <div class="name-span flex row">
        <div class="name">{{clix.name}}</div>
        <div class="cost"> - ({{clix.cost}})</div>
      </div>
      <div class="body-block flex row">
        <div class="image" :style="{backgroundImage: `url(/images/${clix.image})`}">
        </div>

        <div class="abilities">
          <div class="action-parent" v-for="key in abilityKeys">
            <div class="action flex row">
              <div class="action-badge">
                <md-icon :class="`hc ${getBadgeClass(key)}`"></md-icon>
              </div>
              <div class="ability-row flex row" v-for="ability in abilities[key]">
                <ability-badge :ability="ability" :no-border="true">
                </ability-badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import isNil from 'lodash/isNil';
import AbilityBadge from '../widgets/AbilityBadge';
import {getBadge} from '../clixbox/resolvers';
import {ATTACK, DAMAGE, DEFEND, MOVE} from '../../constants';

export default {
  name: 'clix-viewer',
  components: {
    AbilityBadge
  },
  props: {
    clix: Object,
    highlight: Boolean,
    isSmall: Boolean
  },
  data: function() {
    return {
      abilities: {},
      moveBadge: {iconClass: ''},
      defendBadge: {iconClass: ''},
      damageBadge: {iconClass: ''},
      attackBadge: {iconClass: ''}
    };
  },
  computed: {
    abilityKeys: function() {
      return Object.keys(this.abilities);
    }
  },
  methods: {
    getBadgeClass: function(key) {
      const badge = this[`${key}Badge`];

      return isNil(badge) ? '' : badge.iconClass;
    },
    refresh: function() {
      const doIt = async () => {
        const abilityList = this.clix.clix.reduce((abilities, clix) => {
          Object.keys(clix).filter((key) => {
            return (isNil(abilities[key]) || (!abilities[key].includes(clix[key].ability) && key !== '_id'));
          })
          .forEach((goodKey) => {
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
    width: 350px;
    height: 180px;
  }

  .name {
    font-weight: 'bolder'
  }

  .cost {
    font-style: italic;
  }

  .image {
    width: 100px;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .abilities {
    padding-left: 4px;
  }

  .padder {
    padding: 8px;
  }

  .action-badge {
    width: 40px;
    position: relative;
    top: 6px;
  }

</style>
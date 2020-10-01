<template>
  <div class="clix-viewer">
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
              {{key}}
            </div>
            <div class="ability-row flex row" v-for="ability in abilities[key]">
              <ability-badge :ability="ability">
              </ability-badge>
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
      abilities: {}
    };
  },
  computed: {
    abilityKeys: function() {
      return Object.keys(this.abilities);
    }
  },
  methods: {
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
        }

      doIt();
    }
  },
  mounted: function () {
    this.refresh();
  }
};

</script>

<style lang="scss" scoped>

  .name {
    font-weight: 'bolder'
  }

  .cost {
    font-style: italic;
  }

  .image {
    width: 56px;
    height: 56px;
    background-size: contain;
    background-repeat: no-repeat;
  }

</style>
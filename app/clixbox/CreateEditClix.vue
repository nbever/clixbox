<template>
  <div>
    <div class="padder">
      <go-home :crumbs="links" />
    </div>
    <div class="form">
      <div class="title">Add a Clix</div>
      <div class="fields rounded form">
        <div class="flex row">
          <clix-text-field 
            class="field"
            label="Name"
            :value="clix.name"
            :keyup="change('name')"
          >
          </clix-text-field>
          <clix-text-field
            class="field"
            label="Model #"
            :value="clix.model"
            :keyup="change('model')"
          >
          </clix-text-field>
          <clix-text-field
            class="field"
            label="Team"
            :value="clix.release"
            :keyup="change('release')"
          >
          </clix-text-field>
        </div>

        <div class="flex row">
          <clix-text-field
            class="field small"
            label="Cost"
            :value="clix.cost"
            :keyup="change('cost')"
            type="number"
            :inputProps="{min: '0', max: '1000'}"
          >
          </clix-text-field>
          <base-enhancement-combo
            :value="badgeKeywords.move"
            :onChange="badgeSelected('move')"
            :keywords="moveKeywords"
            :defaultBadge="{id: '0', label: '(Standard)', iconClass: 'hc-icon-move'}"
          >
          </base-enhancement-combo>

          <base-enhancement-combo
            :value="badgeKeywords.range"
            :onChange="badgeSelected('range')"
            :customBadges="attackBadges"
            :defaultBadge="{id: '0', label: '(Standard)', iconClass: 'hc-icon-attack'}"
          >
          </base-enhancement-combo>

          <clix-text-field
            v-if="showRangeField"
            class="field small"
            label="Range"
            :value="clix.range"
            :keyup="change('rangeTargets')"
            type="number"
            :inputProps="{min: 0, max: 10}"
          >
          </clix-text-field>

          <base-enhancement-combo
            :value="badgeKeywords.defense"
            :onChange="badgeSelected('defense')"
            :keywords="defenseKeywords"
            :defaultBadge="{id: '0', label: '(Standard)', iconClass: 'hc-icon-defend'}"
          >
          </base-enhancement-combo>
          <base-enhancement-combo
            :value="badgeKeywords.damage"
            :onChange="badgeSelected('damage')"
            :customBadges="damageBadges"
            :defaultBadge="{id: '0', label: '(Standard)', iconClass: 'hc-icon-damage'}"
          >
          </base-enhancement-combo>
        </div>

        <div class="flex row">
          <enhancement-setter
            :enhancements="enhancements"
            :possibleEnhancements="moveEnhancements"
            :enhancementChanged="enhancementChanged"
            categoryClass="hc hc-icon-run"
          >
          </enhancement-setter>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import GoHome from '../widgets/GoHome';
  import ClixTextField from '../widgets/ClixTextField';
  import BaseEnhancementCombo from '../widgets/BaseEnhancementCombo';
  import EnhancementSetter from '../widgets/EnhancementSetter';
  import {
    SWIM,
    FLIGHT,
    MOVE,
    TARGET,
    INDOMITABLE,
    GRAY
  } from '../../constants';

  import isNil from 'lodash/isNil';

  export default {
    components: {
      GoHome,
      ClixTextField,
      BaseEnhancementCombo,
      EnhancementSetter
    },
    computed: {
      showRangeField: function() {
        return !isNil(this.badgeKeywords.range) &&
          (this.badgeKeywords.range.id === '2' ||
            this.badgeKeywords.range.id === '3' ||
            this.badgeKeywords.range.id === '4');
      },
      moveKeywords: function() {
        return [SWIM, FLIGHT];
      },
      defenseKeywords: function() {
        return [INDOMITABLE];
      },
      attackBadges: function() {
        return [
          {id: '1', label: 'Double', iconClass: 'hc-icon-double-fist'},
          {id: '2', label: 'Range', iconClass: 'hc-icon-range'},
          {id: '3', label: 'Multi-Range', iconClass: 'mycons-2-bolts'},
          {id: '4', label: 'Triple-Range', iconClass: 'mycons-3-bolts'}
        ];
      },
      moveEnhancements: function() {
        return this.possibleEnhancements.filter((pe) => {
          return pe.type === MOVE;
        });
      },
      targetEnhancements: function() {
        return this.possibleEnhancements.filter((pe) => {
          return pe.type === TARGET;
        })
      },
      damageBadges: function() {
        return [
          {id: '1', label: 'Tiny', iconClass: 'hc-icon-tiny'},
          {id: '2', label: 'Large', iconClass: 'hc-icon-large'},
          {id: '3', label: 'Colossal', iconClass: 'hc-icon-colossal'}
        ];
      }
    },
    data: function() {
      return {
        links: [
          {link: '/clixbox', label: 'Clix Box'}
        ],
        clix: {
          name: '',
          model: '',
          release: '',
          cost: 50,
          range: 0,
          rangeTargets: 0
        },
        badgeKeywords: {
          move: null,
          defense: null,
          damage: null,
          range: null
        },
        enhancements: [],
        possibleEnhancements: []
      };
    },
    mounted: function() {
      const fx = async () => {
        const allEns = await this.getEnhancements();
        this.possibleEnhancements = Object.values(allEns);
      };

      fx();
    },
    methods: {
      change: function(key) {
        return ($e) => {
          this.clix[key] = $e.target.value;
        }
      },
      badgeSelected: function(key) {
        return (keyword) => {
          this.badgeKeywords[key] = keyword;
        }
      },
      enhancementChanged: function(enhancements) {
        this.enhancements = enhancements;
      }
    }
  }
</script>

<style lang="scss" scoped>
.padder {
  padding: 8px;
}

.field {
  margin-right: 12px;

  &.small {
    width: 50px;
  }
}

.fields {
  background-color: white;
}
</style>
<template>
  <div>
    <div class="header">
      Custom Abilities
    </div>
    <div v-for="(ability, index) in customAbilities" 
      :class="{odd: index % 2 === 1, abilityRow: true}"
    >
      <div class="flex row ability-box">
        <div class="remove mycons-cancel-circle" @click="deleteAbility(index)">

        </div>
        <div style="padding-right: 12px;">
          <div class="flex row align-center">
            <type-drop-down
              class="field"
              :moveBadge="moveBadge"
              :attackBadge="attackBadge"
              :defenseBadge="defenseBadge"
              :damageBadge="damageBadge"
              :badge="ability.badge"
              :badgeChanged="badgeChanged(index)"
            >
            </type-drop-down>

            <clix-text-field
              class="field"
              label="Name"
              :value="ability.action"
              :keyup="change(index, 'action')"
            >
            </clix-text-field>
          </div>

          <div>
            <clix-text-area 
              class="field"
              label="Description"
              :value="ability.text"
              :keyup="change(index, 'text')"
            >
            </clix-text-area>
          </div>
        </div>

        <div>

          <div>
            <div>Abilities</div>
            <ability-builder
              :abilityList="ability.abilities"
              :addAbility="addInnerAbility(index)"
              :removeAbility="removeInnerAbility(index)"
              :changeAbility="changeInnerAbility(index)"
              :category="ability.category"
            >
            </ability-builder>
          </div>

          <div>
            <div>Keywords</div>
            <keyword-builder
              :keywordList="ability.keywords"
              :addKeyword="addInnerKeyword(index)"
              :removeKeyword="removeInnerKeyword(index)"
              :changeKeyword="changeInnerKeyword(index)"
            >
            </keyword-builder>
          </div>

          <div>
            <div>Enhancements</div>
              <div class="flex row">
                <enhancement-setter
                  :enhancements="ability.enhancements.filter((f) => f.type === 'MOVE')"
                  :possibleEnhancements="moveEnhancements"
                  :enhancementChanged="moveEnhancementChanged(index)"
                  categoryClass="hc hc-icon-run"
                  :canAdd="true"
                >
                </enhancement-setter>
              </div>
              <div class="flex row">
                <enhancement-setter
                  :enhancements="ability.enhancements.filter((f) => f.type === 'TARGET')"
                  :possibleEnhancements="targetEnhancements"
                  :enhancementChanged="targetEnhancementChanged(index)"
                  categoryClass="hc hc-icon-target"
                  :canAdd="true"
                >
                </enhancement-setter>
              </div>
          </div>
        </div>
      </div>
    </div>
    <div class="adder">
      <md-button class="md-icon-button md-primary" @click="addAbility">
        <md-icon class="mycons mycons-plus"></md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>

import {ALWAYS} from '../widgets/TypeDropDown';
import TypeDropDown from '../widgets/TypeDropDown';
import ClixTextField from '../widgets/ClixTextField';
import ClixTextArea from '../widgets/ClixTextArea';
import AbilityBuilder from '../widgets/AbilityBuilder';
import KeywordBuilder from '../widgets/KeywordBuilder';
import EnhancementSetter from '../widgets/EnhancementSetter';
import clone from 'lodash/clone';
import {DEFENSE, ATTACK, SPEED, DAMAGE, MOVE, TARGET, DEFEND} from
  '../../constants';

import {rationalizeEnhancementList, keywordsToEnhancements}
  from './resolvers';

export default {
  name: 'custom-abilities',
  props: {
    moveBadge: Object,
    attackBadge: Object,
    defenseBadge: Object,
    damageBadge: Object,
    customAbilities: Array,
    onChange: Function
  },
  data: function() {
    return {
      possibleEnhancements: []
    };
  },
  components: {
    TypeDropDown,
    ClixTextField,
    ClixTextArea,
    AbilityBuilder,
    KeywordBuilder,
    EnhancementSetter
  },
  watch: {
    customAbilities: function() {
      const fx = async () => {
        const allEns = await this.getEnhancements();
        this.possibleEnhancements = Object.values(allEns);

        this.customAbilities.forEach( (ability) => {
          const cat = ability.category;
          const badge = cat === SPEED || cat === MOVE?
            this.moveBadge
            :
            cat === DAMAGE ?
              this.damageBadge
              :
              cat === DEFENSE || cat === DEFEND ?
                this.defenseBadge
                :
                cat === TARGET ?
                  this.attackBadge
                  :
                  ALWAYS;
          ability.badge = badge;
        });
      };

      fx();
    }
  },
  computed: {
    moveEnhancements: function() {
      return this.possibleEnhancements.filter((pe) => {
        return pe.type === MOVE;
      });
    },
    targetEnhancements: function() {
      return this.possibleEnhancements.filter((pe) => {
        return pe.type === TARGET;
      })
    }
  },
  methods: {
    change: function(index, prop) {
      return ($e) => {
        const list = this.customAbilities.map((c, cIndex) => {
          if (cIndex !== index) {
            return c;
          }

          const newOne = clone(c);
          newOne[prop] = $e.target.value;
          return newOne
        });

        this.onChange(list);
      };
    },
    deleteAbility: function(abilityIndex) {

      const newList = this.customAbilities.filter((c, index) => {
        return index !== abilityIndex;
      });

      this.onChange(newList);
    },
    addAbility: function() {

      const newAbility = {
        action: '',
        color: 'white',
        text: '',
        category: 'ALL',
        enhancements: [],
        keywords: [],
        abilities: [],
        badge: ALWAYS
      };

      this.onChange([...this.customAbilities, newAbility]);
    },
    badgeChanged: function(index) {
      return ($e) => {
        const list = this.customAbilities.map((c, cIndex) => {
          if (index !== cIndex) {
            return c;
          }

          const newOne = clone(c);
          newOne.badge = $e;

          const newCategory = newOne.badge === this.damageBadge ?
            DAMAGE 
            :
            newOne.badge === this.attackBadge ?
              ATTACK
              :
              newOne.badge === this.moveBadge ?
                SPEED
                :
                newOne.badge === this.defenseBadge ?
                  DEFENSE
                  :
                  'ALL';
          newOne.category = newCategory;
          newOne.abilities = [];

          return newOne;
        });

        this.onChange(list);
      };
    },
    addInnerAbility: function(index) {
      return (ability) => {
        this.customAbilities[index].abilities.push(ability);
      };
    },
    removeInnerAbility: function(index) {
      return (innerIndex) => {
        this.customAbilities[index].abilities.splice(innerIndex, 1);
      };
    },
    changeInnerAbility: function(index) {
      return (innerIndex, ability) => {
        // this.customAbilities[index].abilities[innerIndex] = ability;
        this.customAbilities[index].abilities.splice(innerIndex, 1, ability);
      };
    },
    addInnerKeyword: function(index) {
      return (keyword) => {
        this.customAbilities[index].keywords.push(keyword);
        this.fixEnhancementList(index);
      };
    },
    removeInnerKeyword: function(index) {
      return (innerIndex) => {
        this.customAbilities[index].keywords.splice(innerIndex, 1);
        this.fixEnhancementList(index);
      };
    },
    changeInnerKeyword: function(index) {
      return (innerIndex, keyword) => {
        this.customAbilities[index].keywords.splice(innerIndex, 1, keyword);
        this.fixEnhancementList(index);
      };
    },
    moveEnhancementChanged: function(index) {
      return (enhancements) => {
        this.customAbilities[index].enhancements = enhancements;
      };
    },
    targetEnhancementChanged: function(index) {
      return (enhancements) => {
        this.customAbilities[index].enhancements = enhancements;
      };
    },
    fixEnhancementList: function(index) {
      
      const fixEnhancements = async () => {
        const results = await keywordsToEnhancements(this.customAbilities[index].keywords,
          this.customAbilities[index].enhancements, this);
        const finalList = await rationalizeEnhancementList(results, 
          this.customAbilities[index].enhancements);
        this.customAbilities[index].enhancements = finalList; 
      };

      fixEnhancements();
    }
  }
};

</script>

<style lang="scss" scoped>
@import '../../variables';

.ability-box {
  position: relative;
}

.adder {
  width: 100%;
}

.abilityRow {
  padding: 12px;
  border: 1px solid $light-gray;
  border-radius: 6px;
}

.field {
  padding-right: 8px;
}

.odd {
  background-color: $light-gray;
}

.remove {
  position: absolute;
  top: -20px;
  font-size: 20px;
  right: -22px;
  background-color: white;
  cursor: pointer;
  border-radius: 10px;
  padding: 1px;

  &:hover {
    background-color: $gray;
  }
}

</style>
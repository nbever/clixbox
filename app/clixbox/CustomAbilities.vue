<template>
  <div>
    <div class="header">
      Custom Abilities
    </div>
    <div v-for="(ability, index) in customAbilities" 
      :class="{odd: index % 2 === 1, abilityRow: true}"
    >

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
          :value="ability.name"
          :keyup="change(index, 'name')"
        >
        </clix-text-field>

        <div>
          <div>Enhancements</div>
        </div>

        <div>
          <div>Abilities</div>
        </div>
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
import clone from 'lodash/clone';

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
  components: {
    TypeDropDown,
    ClixTextField,
    ClixTextArea
  },
  computed: {

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
        action: 'New',
        color: 'white',
        text: '',
        category: 'MOVE',
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
          return newOne;
        });

        this.onChange(list);
      };
    }
  }
};

</script>

<style lang="scss" scoped>
@import '../../variables';

.adder {
  width: 100%;
}

.abilityRow {
  padding: 12px;
}

.field {
  padding-right: 8px;
}

.odd {
  background-color: $light-gray;
  border-radius: 6px;
}

</style>
<template>
  <div class="flex row" @click="toggleEditMode">
    <div :style="color" class="value-box">
      <div v-if="!editMode">{{clickValue}}</div>
      <input
        v-if="editMode"
        class="no-outline"
        type="number"
        :value="value"
        @keyup="valueChanged"
        min="0"
        max="20"
      >
      </input>
    </div>
    <div v-if="editable" @click="toggleAbilities">
      <md-menu md-size="auto">
        <div md-menu-trigger class="clicker">
          &#x25BC;
        </div>

        <md-menu-content>
          <md-menu-item v-for="ability in abilities" 
            class="menu-item"
            @click="abilityChangedInternally(ability)"
          >
            <div class="flex row">
              <div 
                class="orb-small border" 
                :style="{backgroundColor: ability.color}"
              >
              </div>
              <div>
                <div class="ability-title">{{ability.action}}</div>
                <div class="little-text">
                  {{ability.text}}
                </div>
              </div>
            </div>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    </div>
  </div>
</template>

<script>
import isNil from 'lodash/isNil';

export default {
  name: 'click-display',
  props: {
    value: Number,
    ability: Object,
    abilities: Array,
    editable: Boolean,
    onChange: Function
  },
  data: function() {
    return {
      showAbilities: false,
      editMode: false
    }
  },
  computed: {
    color: function() {
      if (isNil(this.ability)) {
        return {};
      }

      return {
        backgroundColor: this.ability.color
      };
    },
    clickValue: function() {
      if (this.value === -1) {
        return 'KO';
      }

      return this.value;
    }
  },
  methods: {
    toggleEditMode: function() {
      if (this.editable === false) {
        return;
      }

      this.editMode = true;
    },
    toggleAbilities: function() {
      if (this.editMode === false) {
        return;
      }

      this.showAbilities = true;
    },
    abilityChangedInternally: function(newAbility) {
      
      this.showAbilities = false;
      this.onChange(newAbility, this.value);
    },
    valueChanged: function($e) {
      this.onChange(this.ability, parseInt($e.target.value));
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../../variables';

.ability-title {
  font-weight: bolder;
  text-transform: capitalize;
  font-size: 12px;
}

.little-text {
  font-size: 10px;
  white-space: normal !important;
}

.border {
  border-radius: 24px;
  border: 1px solid $middle_gray;
  margin-right: 4px;
}

.value-box {
  padding: 4px;
  text-align: center;
  height: 28px;
  min-width: 24px;
}

.clicker {
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    opacity: 1.0;
  }
}

.no-outline {
  outline: none;
}

.orb {
  position: relative;
  width: 48px;
  height: 48px;
  font-size: 32px;
  padding: 8px;
}

.orb-small {
  position: relative;
  width: 24px;
  height: 24px;
  font-size: 28px;
  padding: 12px;
}

</style>
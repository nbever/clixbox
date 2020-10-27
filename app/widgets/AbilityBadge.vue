<template>
  <div class="ability-badge">
    <div class="orb-small border tooltip-target" 
      :style="{backgroundColor: ability !== undefined ? ability.color : 'white', marginRight: noBorder ? '2px' : '16px'}"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
    </div>
    <div :class="['tt', 'flex', 'column',(hovered === true ? 'show' : '')]" 
    >
        <div class="tt-title">{{action}}</div>
        <div class="tt-text">
          {{text}}
        </div>
    </div>
  </div>
</template>

<script>

import isNil from 'lodash/isNil';

export default {
  name: 'ability-badge',
  props: {
    ability: Object,
    customAbility: Object,
    noBorder: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      hovered: false
    };
  },
  computed: {
    action: function() {
      return isNil(this.ability) ? '' : this.ability.action;
    },
    text: function() {
      return isNil(this.ability) ? '' : this.ability.text;
    }
  }
};

</script>

<style lang="scss" scoped>
@import '../../variables';

.ability-badge {
  position: relative;
}

.orb-small {
  position: relative;
  width: 24px;
  height: 24px;
  font-size: 28px;
  padding: 12px;
}

.border {
  border: 1px solid $middle_gray;
  border-radius: 26px;
}

.slim {
  margin: 0px !important;
}

.tt {
  display: none;
  position: absolute;
  z-index: 99;
  max-width: 350px;
  min-width: 200px;
  background-color: $dark_gray;
  color: white;
  transition: 100ms;
  padding: 12px;
  border-radius: 6px;
}

.show {
  display: block;
}

.tt-title {
  color: white;
  font-weight: bolder;
  font-size: 14px;
}

.tt-text {
  color: white;
  font-size: 10px;
}

</style>
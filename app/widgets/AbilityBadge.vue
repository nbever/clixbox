<template>
  <div class="ability-badge">
    <div class="orb-small border" :style="{backgroundColor: ability.color}">
    </div>
    <md-tooltip md-delay="200ms">
      Hello
    </md-tooltip>
  </div>
</template>

<script>

export default {
  name: 'ability-badge',
  props: {
    ability: Object,
    customAbility: Object
  }
};

</script>

<style lang="scss" scoped>
@import '../../variables';

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
  margin-right: 16px;
}

</style>
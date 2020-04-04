<template>
  <div class="type-drop-down">
    <md-menu md-size="auto">
        <div md-menu-trigger class="clicker flex row">
          <div :class="`hc ${selectedBadge.iconClass}`">
          </div>
          <div>
            &#x25BC;
          </div>
        </div>

        <md-menu-content>
          <md-menu-item v-for="badge in badges" class="badge"
            @click="badgeSelected(badge)"
          >
            <div :class="`hc ${badge.iconClass}`">
            </div>
          </md-menu-item>
        </md-menu-content>
    </md-menu>
  </div>

</template>

<script>

import isNil from 'lodash/isNil';

export const ALWAYS = {
  id: 'ALWAYS',
  iconClass: 'hc-icon-star',
  label: 'Always'
};

export default {
  name: 'type-drop-down',
  props: {
    moveBadge: Object,
    attackBadge: Object,
    defenseBadge: Object,
    damageBadge: Object,
    badge: Object,
    badgeChanged: Function
  },
  computed: {
    selectedBadge: function() {
      return isNil(this.badge) || this.badge.id === 'ALWAYS' ?
        ALWAYS : this.badge;
    },
    badges: function() {
      return [ALWAYS, this.moveBadge, this.attackBadge,
        this.defenseBadge, this.damageBadge];
    }
  },
  methods: {
    badgeSelected: function($e) {
      this.badgeChanged($e);
    }
  }
}
</script>

<style lang="scss" scoped>

.clicker {
  cursor: pointer;
}

.hc {
  font-size: 24px;
}
</style>
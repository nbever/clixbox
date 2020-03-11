<template>
  <div class="flex row center">
    <div class="classifier orb">
      <div :class="categoryClass" :style="{paddingTop: '12px'}"></div>
    </div>
    <div v-for="enhancement in enhancements" 
      class="orb-small border" :style="{backgroundColor: enhancement.color}">
      <div v-if="isIconNull(enhancement)" 
        :class="`overlay hc hc-icon-${enhancement.icon.toLowerCase()}`">
      </div>

      <div v-if="canChange(enhancement)">
        <md-menu md-size="auto">
          <div md-menu-trigger class="clicker">
            &#x25BC;
          </div>

          <md-menu-content>
            <md-menu-item v-for="(option, index) in menuItems" class="menu-item">
              <div class="flex row" @click="enhancementChanged(option, index)">
                <div 
                  class="orb-small border" 
                  :style="{backgroundColor: option.color}"
                >
                  <div v-if="isIconNull(option)"
                    :class="`menu-overlay hc hc-icon-${option.icon.toLowerCase()}`"
                  >
                  </div>
                </div>
                <div class="little-text">
                  {{option.text}}
                </div>
              </div>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>

    </div>
    <div class="add-enhancement">
      <md-button class="md-icon-button"
        @click="addEnhancement"
      >
        <md-icon class="myicons mycons-plus"></md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
  import isNil from 'lodash/isNil';

  export default {
    name: 'enhancement-setter',
    props: {
      enhancements: Array,
      possibleEnhancements: Array,
      enhancementChanged: Function,
      categoryClass: String
    },
    computed: {
      menuItems: function() {
        const notChosen = this.possibleEnhancements.filter((pe) => {
          const used = pe.icon !== 'star' ?
            this.enhancements.find((e) => {
              return pe === e;
            })
            :
            null;

          return isNil(used);
        });

        return notChosen;
      }
    },
    methods: {
      addEnhancement: function() {
        this.enhancementChanged(
          {}
        );
      },
      isIconNull: function(enhancement) {
        return !isNil(enhancement) &&
          !isNil(enhancement.icon);
      },
      canChange: function(enhancement) {
        return isNil(enhancement) || 
          isNil(enhancement.locked) ||
          enhancement.locked === false;
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '../../variables';

.center {
  align-items: center;
}

.little-text {
  font-size: 10px;
  white-space: normal !important;
}

.menu-item {
  cursor: pointer;

  &:hover {
    background-color: $gray;
  }
}

.clicker {
  font-size: 16px;
  position: absolute;
  bottom: -8px;
  right: -12px;
  cursor: pointer;
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

.border {
  border: 1px solid $middle_gray;
  border-radius: 26px;
  margin-right: 16px;
}

.overlay {
  position: absolute;
  top: 3px;
  left: 0px;
  color: $dark_gray;
}

.menu-overlay {
  position: absolute;
  top: 2px;
  left: 3px;
  color: black;
  font-size: 24px;
}

</style>
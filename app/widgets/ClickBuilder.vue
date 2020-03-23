<template>
  <div class="click-builder flex row">
    <div class="legend">
      <div class="value-box"></div>
      <div>
        <md-icon :class="myIcon('moveBadge')">
        </md-icon>
      </div>
      <div>
        <md-icon :class="myIcon('attackBadge')">
        </md-icon>
      </div>
      <div>
        <md-icon :class="myIcon('defenseBadge')">
        </md-icon>
      </div>
      <div>
        <md-icon :class="myIcon('damageBadge')">
        </md-icon>
      </div>
    </div>
    <click-setter 
      v-for="(click, index) in clicks"
      :move="click.move"
      :defend="click.defend"
      :damage="click.damage"
      :attack="click.attack"
      :ordinal="index"
      :deleteClick="deleteClick(index)"
      :onChange="clickChanged(index)"
    >
    </click-setter>
    <div class="big-column flex column middle">
      <md-button class="md-icon-button md-primary" @click="addClick">
        <md-icon class="mycons mycons-plus"></md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import clone from 'lodash/clone';
import isNil from 'lodash/isNil';
import ClickSetter from './ClickSetter';

export default {
  name: 'click-builder',
  props: {
    moveBadge: Object,
    defenseBadge: Object,
    damageBadge: Object,
    attackBadge: Object,
    clicks: Array,
    clicksChanged: Function
  },
  components: {
    ClickSetter
  },
  methods: {
    addClick: function() {
      const lastClick = this.clicks.length > 0 ?
        clone(this.clicks[this.clicks.length - 1])
        :
        {
          ordinal: 0,
          move: {value: 8, ability: null},
          attack: {value: 12, ability: null},
          defend: {value: 12, ability: null},
          damage: {value: 17, ability: null}
        };

      lastClick.ordinal = lastClick.ordinal + 1;
      const newList = [...this.clicks, lastClick];
      this.clicksChanged(newList);
    },
    myIcon: function(key) {
      const item = this[key];

      return (isNil(item) || isNil(item.iconClass)) ?
        'hc value-box'
        :
        `hc value-box ${item.iconClass}`;
    },
    deleteClick: function(index) {
      return () => {
        const newList = this.clicks
          .filter((c, cIndex) => {
            return cIndex !== index;
          })
          .map((newC, newIndex) => {
            newC.ordinal = newIndex;
            return newC;
          });

        this.clicksChanged(newList);
      }
    },
    clickChanged: function(index) {
      return (newItem, key) => {

      };
    }
  }
}
</script>

<style lang="scss" scoped>

.value-box {
  padding: 4px;
  text-align: center;
  min-height: 28px;
  min-width: 24px;
}

.legend {
  padding-right: 12px;
  padding-top: 2px;
}

</style>
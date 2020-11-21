<template>
  <div class="clicker">

    <div class="take-damage">
      <md-button @click="takeDamage" class="md-icon-button">
        <md-icon class="mycons mycons-plus" />
      </md-button>
    </div>

    <div class="heal">
      <md-button @click="heal" class="md-icon-button">
        <md-icon class="mycons mycons-minus" />
      </md-button>
    </div>

    <svg width="200" height="100" viewBox="0 0 200 100">
      <path fill="black" d="M0 0 A100 100 45 1 0 200 0 M85 10 L108 10 L108 60 L108 60 L125 60 L125 88 L85 88 Z">
      </path>
    </svg>

    <div class="badges">
      <div :class="`hc ${icon('MOVE')} move badge ${getFlightModifier}`">
      </div>
      <div :class="`hc ${icon('ATTACK')} attack badge`">
      </div>
      <div :class="`hc ${icon('DEFEND')} defend badge`">
      </div>
      <div :class="`hc ${icon('DAMAGE')} damage badge`">
      </div>
    </div>

    <div class="click-values">
      <div 
        v-for="key in ['move', 'attack', 'defend', 'damage']"
        :style="getStyle(key)"
        :class="{ 'click-value' : true, 'damage-value': key === 'damage'}"
      >
        <div>{{getValue(key)}}</div>
        <div></div>
      </div>
    </div>

  </div>
</template>

<script>
  import isNil from 'lodash/isNil';

  export default {
    name: 'clicker',
    props: {
      click: Object,
      takeDamage: Function,
      heal: Function,
      badges: Object,
      abilities: Object
    },
    computed: {
      getFlightModifier: function() {
        return isNil(this.badges['MOVE']) ?
          ''
          :
          this.badges['MOVE'].iconClass.indexOf('flight') > -1 ?
            'shrinkme' : '';
      }
    },
    methods: {
      icon: function(key) {
        return isNil(this.badges[key]) ?
          '' : this.badges[key].iconClass;
      },
      getValue: function(key) {
        return isNil(this.click) || isNil(this.click[key]) ?
          'KO'
          :
          this.click[key].value;
      },
      getStyle: function(key) {

        if (this.getValue(key) === 'KO') {
          return {color: 'red !important', fontWeight: 'bold'};
        }

        return isNil(this.abilities) || 
          isNil(this.abilities[key]) ?
          {}
          :
          this.abilities[key].category === 'CUST' || 
            this.abilities[key].color === 'white' ?
            {border: '1px solid #e1e1e1'}
            :
            {
              backgroundColor: this.abilities[key].color,
              color: 'white'
            };
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .clicker {
    width: 100px;
    height: 100px;
    position: relative;
  }

  .badges {
    position: absolute;
    top: 16px;
    left: 60px;
  }

  .badge {
    color: white;
    font-size: 20px;
    margin-bottom: 4px;
  }

  .damage {
    position: absolute;
    left: 70px;
    bottom: 0px;
  }

  .shrinkme {
    font-size: 14px;
    position: relative;
    left: -8px;
  }

  .click-values {
    position: absolute;
    top: 13px;
    left: 88px;
  }

  .click-value {
    margin-bottom: 5px;
    width: 16px;
  }

  .damage-value {
    position: absolute;
    left: 20px;
    bottom: 1px;
  }

  .take-damage {
    position: absolute;
    right: -104px;
    bottom: -7px;
  }

  .heal {
    position: absolute;
    right: 53px;
    bottom: -7px;
  }

</style>
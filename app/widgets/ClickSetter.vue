<template>
  <div class="click-view">
    <div class="ordinal">
      {{(ordinal + 1)}}
    </div>
    <click-display 
      :editable="true" 
      :value="move" 
      :abilities="moveAbilities"
      :onChange="clickChanged('move')"
    >
    </click-display>
    <click-display 
      :editable="true" 
      :value="attack"
      :abilities="attackAbilities"
      :onChange="clickChanged('attack')"
    >
    </click-display>
    <click-display 
      :editable="true" 
      :value="defend"
      :abilities="defenseAbilities"
      :onChange="clickChanged('defend')"
    >
    </click-display>
    <click-display 
      :editable="true" 
      :value="damage"
      :abilities="damageAbilities"
      :onChange="clickChanged('damage')"
    >
    </click-display>
    <div class="deleter mycons-cancel-circle"
        @click="deleteClick"
    >
    </div>
  </div>
</template>

<script>
  import ClickDisplay from './ClickDisplay';
  import {
    SPEED,
    DAMAGE,
    ATTACK,
    DEFENSE
  } from '../../constants';

  const filterBy = function (category, abilities) {
    return abilities.filter((a) => {
      return a.category === category;
    });
  };

  export default {
    name: 'click-setter',
    components: {
      ClickDisplay
    },
    computed: {
      moveAbilities: function() {
        return filterBy(SPEED, this.abilities);
      },
      attackAbilities: function() {
        return filterBy(ATTACK, this.abilities);
      },
      defenseAbilities: function() {
        return filterBy(DEFENSE, this.abilities);
      },
      damageAbilities: function() {
        return filterBy(DAMAGE, this.abilities);
      }
    },
    data: function() {
      return {
        abilities: []
      }
    },
    mounted: function() {
      const doIt = async () => {
        const fullList = await this.getAbilities();
        this.abilities = Object.values(fullList);
      };

      doIt();
    },
    props: {
      ordinal: Number,
      move: Object,
      attack: Object,
      damage: Object,
      defend: Object,
      onChange: Function,
      deleteClick: Function
    },
    methods: {
      clickChanged: function(key) {
        return (newAbility, newValue) => {
          const o = {
            ability: newAbility,
            value: newValue
          };

          this.onChange(o, key);
        }
      }
    },
    updated: function() {
      console.log('ClickSetter updated');
    }
  }
</script>

<style lang="scss" scoped>
@import '../../variables';

  .ordinal {
    color: $red;
    border-bottom: 1px solid $red;
    text-align: center;
    width: 100%;
    min-height: 28px;
    min-width: 24px;
    margin-bottom: 3px;
  }

  .deleter {
    cursor: pointer;
    opacity: 0.7;
    height: 28px;
    width: 24px;
    text-align: center;

    &:hover {
      opacity: 1.0;
    }
  }
</style>
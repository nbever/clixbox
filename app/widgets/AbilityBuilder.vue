<template>
  <div class="ability-builder flex row">
    <div v-for="(ability, index) in abilityList" 
      class="orb-small border" :style="{backgroundColor: ability.color}">

      <div class="delete mycons-cancel-circle" @click="deleteAbility(index)">
      </div>

      <div>
        <md-menu md-size="auto">
          <div md-menu-trigger class="clicker">
            &#x25BC;
          </div>

          <md-menu-content>
            <md-menu-item v-for="option in menuItems" 
              class="menu-item"
              @click="abilityChanged(option, index)"
            >
              <div class="flex row">
                <div 
                  class="orb-small border" 
                  :style="{backgroundColor: option.color}"
                >
                </div>
                <div>
                  <div class="ability-title">{{option.action}}</div>
                  <div class="little-text">
                    {{option.text}}
                  </div>
                </div>
              </div>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>

    </div>
    <div class="add-ability">
      <md-button class="md-icon-button"
        @click="newAbility"
      >
        <md-icon class="myicons mycons-plus"></md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
  import isNil from 'lodash/isNil';

  export default {
    name: 'ability-builder',
    props: {
      category: String,
      abilityList: Array,
      addAbility: Function,
      changeAbility: Function,
      removeAbility: Function
    },
    data: function() {
      return {
        abilities: []
      };
    },
    computed: {
      menuItems: function() {
        return this.getAvailableAbilities();
      }
    },
    methods: {
      deleteAbility: function(index) {
        this.removeAbility(index);
      },
      newAbility: function() {
        const availableValues = this.getAvailableAbilities();
        this.addAbility(this.menuItems[0]);
      },
      abilityChanged: function(ability, index) {
        this.changeAbility(index, ability);
      },
      getAvailableAbilities: function() {
        return this.abilities
          .filter((a1) => {
            return this.category === 'ALL' ||
              a1.category === this.category;
          })
          .filter((a) => {
            const match = this.abilityList.find((al) => {
              return al._id === a._id;
            });

            return isNil(match);
          });
      }
    },
    mounted: function() {
      const fx = async () => {
        const abilitiesObj = await this.getAbilities();
        this.abilities = Object.values(abilitiesObj);
      };

      fx();
    }
  };
</script>

<style lang="scss" scoped>
@import '../../variables';

.center {
  align-items: center;
}

.delete {
  position: absolute;
  top: -1px;
  font-size: 12px;
  right: -7px;
  background-color: white;
  cursor: pointer;
  border-radius: 10px;
  padding: 1px;

  &:hover {
    background-color: $gray;
  }
}

.ability-title {
  font-weight: bolder;
  text-transform: capitalize;
  font-size: 12px;
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
  font-size: 14px;
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
</style>
<template>
  <div class="player-team-selector"
    :class="{'something-selected' : isPlayerSelected}"
  >
    <div class="player-name" 
      @click="playerSelected"
      :class="{'selected-player' : isPlayerSelected}"
    >
      <span>{{player.name}}<span>
      <span v-if="totalCost !== undefined" class="handicap">({{pointsRemaining}})</span>
    </div>
    <div v-for="(click, index) in clix" class="clix flex row"
      @click="clixSelected(index)"
    >
      <div class="cost">{{click.cost}}</div>
      <div class="clix-name">{{click.name}}</div>
    </div>
  </div>
</template>

<script>

  import isNil from 'lodash/isNil';

  export default {
    name: 'player-team-selector',
    props: {
      player: Object,
      totalCost: Number,
      clix: {
        type: Array,
        default: () => []
      },
      currentSelection: {
        type: Object,
        default: {}
      },
      click: Function
    },
    computed: {
      isPlayerSelected: function() {
        return this.player === this.currentSelection.player;
      },
      isClixSelected: function() {
        return !isNil(this.clix.find((c) => {
          return c === this.currentSelection.click;
        }));
      },
      pointsRemaining: function() {
        const sum = this.clix.reduce((total, clix) => {
          return total + clix.cost;
        }, 0);

        return this.totalCost + parseInt(this.player.handicap) - sum;
      }
    },
    methods: {
      deleteClix: function(index) {

      },
      clixSelected: function(index) {
        this.click(this.player, this.clix[index]);
      },
      playerSelected: function() {

        this.click(this.player, null);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .player-team-selector {
    cursor: pointer;
  }

  .player-team-selector:hover {
    background-color: white;
  }

  .something-selected {
    background-color: white;
  }

  .clix:hover {
    background-color: $light_gray;
  }

  .selected-player {
    background-color: $dark_gray;
    color: white;
  }

  .selected-clix {
    background-color: $middle_gray;
    color: white;
  }

  .player-name {
    padding: 8px;
    font-weight: bold;
  }

  .clix {
    padding: 8px;
    padding-left: 4px;
  }

  .handicap {
    padding-left: 2px;
    font-style: italic;
    font-weight: normal;
  }

</style>
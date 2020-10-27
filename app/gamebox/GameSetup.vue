<template>
  <div class="game-setup flex column">

    <div class="padder">
      <go-home :crumbs="links" />
    </div>

    <div class="selection-area flex row">
      <div class="player-bar-parent">
        <div class="player-bar">
          <div v-for="player in players">
            <player-team-selector 
              :player="player"
              :totalCost="cost"
              :currentSelection="currentTreeSelection"
              :click="itemSelected"
              :infoClicked="showClixDetails"
            >
            </player-team-selector>
          </div>
        </div>
      </div>

      <div class="selector-parent">
        <div class="selector flex row">
          <clix-viewer v-for="clix in clixChoices"
            :clix="clix"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import GoHome from '../widgets/GoHome';
  import PlayerTeamSelector from './PlayerTeamSelector';
  import ClixViewer from '../widgets/ClixViewer';
  import isNil from 'lodash/isNil';

  export default {
    name: 'game-setup',
    components: {
      GoHome,
      PlayerTeamSelector,
      ClixViewer
    },
    props: {
      players: Array,
      name: String,
      cost: Number
    },
    data: function() {
      return {
        links: [
          {link: '/gamebox', label: 'Game Box'},
          {link: '/gamebox/create', label: 'Create Game'}
        ],
        selectedPlayer: this.players[0],
        selectedClix: null,
        availableClix: []
      }
    },
    computed: {
      currentTreeSelection: function() {
        return {player: this.selectedPlayer, click: this.selectedClix};
      },
      clixChoices: function() {

        if (isNil(this.selectedPlayer)) {
          return this.availableClix;
        }

        if (isNil(this.selectedPlayer.clix)) {
          this.selectedPlayer.clix = [];
        }

        const fundsLeft = this.cost - this.selectedPlayer.clix.reduce((total, c) => {
          return total + c.cost;
        }, 0);

        return this.availableClix.filter((ac) => {
          return ac.cost <= fundsLeft;
        });
      }
    },
    methods: {
      itemSelected: function(player, click) {
        this.selectedPlayer = player;
        this.selectedClix = click;
      },
      showClixDetails: function(clix) {

      }
    },
    mounted: function() {
      const doIt = async () => {
        const clix = await this.getAllClix();
        this.availableClix = Object.keys(clix).map((key) => {
          return clix[key];
        });
      };

      doIt();
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .game-setup {
    height: 100%;
    overflow: hidden;
  }

  .selection-area {
    flex-grow: 1;
    flex-shrink: 1;
    background-color: white;
    overflow: hidden;
  }

  .player-bar-parent {
    position: relative;
    overflow: auto;
  }

  .player-bar {
    min-width: 200px;
    min-height: 100%;
    background-color: $light_gray;
  }

  .selector-parent {
    overflow: auto;
  }

  .selector {
    flex-wrap: wrap;
    padding: 8px;
    cursor: pointer;
  }

</style>
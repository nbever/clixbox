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
              :clix="getClix(player)"
              :deleteClick="deleteClix"
            >
            </player-team-selector>
          </div>
          <div class="start">
            <md-button class="md-raised" :disabled="!canStart" @click="startGame">Start</md-button>
          </div>
        </div>
      </div>

      <div class="selector-parent">
        <div class="selector flex row">
          <clix-viewer v-for="clix in clixChoices"
            :clix="clix" :clickCallback="itemChosen"
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
  import clone from 'lodash/clone';

  export default {
    name: 'game-setup',
    components: {
      GoHome,
      PlayerTeamSelector,
      ClixViewer
    },
    props: {
      players: {
        type: Array,
        default: () => []
      },
      name: String,
      cost: Number,
      clixDict: {
        type: Object,
        default: () => { return {}; }
      }
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
      canStart: function() {
        return this.players.every((player) => {
          return this.getClix(player).length > 0;
        });
      },
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

        const fundsLeft = this.cost - this.getClix(this.selectedPlayer).reduce((total, c) => {
          return total + parseInt(c.cost);
        }, 0);

        const usedClix = Object.keys(this.clixDict).reduce((list, key) => {
          return list.concat(this.clixDict[key]);
        }, []);

        return this.availableClix
          .filter((ac) => {
            const used = usedClix.find((uc) => {
              return ac == uc;
            });
            return ac.cost <= fundsLeft && !used;
          });
      }
    },
    methods: {
      getClix: function(player) {
        return isNil(this.clixDict[player.name]) ?
          []
          :
          this.clixDict[player.name];
      },
      itemSelected: function(player, click) {
        this.selectedPlayer = player;
        this.selectedClix = click;
      },
      itemChosen: function(click) {
        const clix = this.getClix(this.selectedPlayer);
        const cloneClix = clone(clix);
        cloneClix.push(click);
        this.$set(this.clixDict, this.selectedPlayer.name, cloneClix);
      },
      showClixDetails: function(clix) {

      },
      deleteClix: function(player, clixIndex) {
        const clix = this.getClix(player);
        clix.splice(clixIndex, 1);
      },
      startGame: function() {

        const teams = Object.keys(this.clixDict).map((playerName) => {
          return {
            player: playerName,
            roster: this.clixDict[playerName].map((clix) => {
              return {
                onClick: 1,
                actionTokens: 0,
                knockedOut: false,
                notes: '',
                clix: clix._id
              };
            })
          };
        });

        const game = {
          name: this.name,
          cost: this.cost,
          teams: teams,
          turn: teams[0].player
        };

        const start = async () => {
          const newGame = await this.createGame(game);
          this.$router.push(`/game/${newGame._id}`);
        };

        start();
      }
    },
    mounted: function() {
      const doIt = async () => {
        const clix = await this.getAllClix();
        this.availableClix = Object.keys(clix).map((key) => {
          return clix[key];
        });

        this.selectedPlayer = this.players[0];
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
    min-width: 200px;
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

  .start {
    text-align: center;
  }

</style>
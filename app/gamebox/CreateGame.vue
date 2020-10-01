<template>
  <div class="create-game">

    <div class="padder">
      <go-home :crumbs="links" />
    </div>

    <div class="form">

      <div class="title">Start a Game</div>
      <div class="fields rounded form">
        <div class="flex row" style="width: 400px">

          <clix-text-field 
            class="field"
            label="Name"
            :value="name"
            :keyup="change('name')"
          >
          </clix-text-field>
        </div>

        <div class="flex row" style="width: 150px">
          <clix-text-field 
            class="field"
            label="Game Cost"
            :value="cost"
            :keyup="change('cost')"
            type="number"
            :inputProps="{min: '50', max: '9999'}"
          >
          </clix-text-field>
        </div>

        <div class="flex row">
          <clix-cool-spinner
            label="Number of Players"
            addTooltip="Add another player"
            minusTooltip="Remove the last player"
            :onChange="playerNumberChanged"
            :value="numberOfPlayers"
          >
          </clix-cool-spinner>
        </div>

        <div class="rounded player-box">
          <player-setup-box v-for="(player, index) in players"
            :player="player"
            :index="index"
            :onChange="playerChanged(index)"
          >
          </player-setup-box>
        </div>
      
        <div class="button">
          <md-button
            class="md-raised"
            @click="pickPlayers"
          >
            Start Player Draft
          </md-button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>

  import GoHome from '../widgets/GoHome';
  import ClixTextField from '../widgets/ClixTextField';
  import ClixCoolSpinner from '../widgets/ClixCoolSpinner';
  import PlayerSetupBox from './PlayerSetupBox';
  import isNil from 'lodash/isNil';

  export default {
    name: 'creategame',
    components: {
      GoHome,
      ClixTextField,
      ClixCoolSpinner,
      PlayerSetupBox
    },
    data: function() {
      return {
        links: [
          {link: '/gamebox', label: 'Game Box'}
        ],
        cost: 300,
        name: '',
        players: [
          {name: '', handicap: 0},
          {name: '', handicap: 0}
        ]
      };
    },
    computed: {
      numberOfPlayers: function() {
        return this.players.length;
      }
    },
    methods: {
      change: function(key) {
        return ($e) => {
          this[key] = $e.target.value;
        }
      },
      playerNumberChanged: function(playerNumber) {
        if (playerNumber > this.players.length) {
          this.players.push({name: '', handicap: 0});
        }
        else {
          this.players = this.players.slice(0, playerNumber);
        }
      },
      playerChanged: function(index) {

        return function(player) {
          this.players.splice(index, 1, player);
        }.bind(this);
      },
      pickPlayers: function() {

        if (this.name.trim().length === 0 || parseInt(this.cost) < 50) {
          this.$root.setError('A name and cost above 50 must be provided.');
          return;
        }

        if (!this.players.every((p) => {
          return p.name.trim().length > 0;
        })) {
          this.$root.setError('Every player must have a name.');
          return;
        }

        this.$router.push({
          path: '/gamebox/setup', 
          query: {players: encodeURIComponent(JSON.stringify(this.players)), name: this.name, cost: this.cost}
        });
      }
    }
  };

</script>

<style lang="scss" scoped>
  @import '../../variables';

  .padder {
    padding: 8px;
  }

  .field {
    margin-right: 24px;
    &.small {
      width: 50px;
    }
  }

  .button {
    text-align: left;
  }

  .fields {
    background-color: white;
    text-align: center;
    padding-left: 24px;
    margin-right: 24px;
  }
</style>
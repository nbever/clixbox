<template>
  <div class="game-view flex column hidden">
    <GoHome :crumbs="crumbs"></GoHome>
    <div class="title stiff middle">{{gameName}}</div>
    <div class="player-marker stiff"></div>
    <div class="clix-status grow auto">
      <md-tabs class="padme" v-if="game !== null">

        <template slot="md-tab" slot-scope="{ tab }">
          {{tab.label}} 
          <i class="active" v-if="tab.data.active === true">
            
          </i>
        </template>

        <md-tab 
          md-dynamic-height
          v-for="team in game.teams" 
          :md-label="team.player"
          :md-template-data="{ active: game.turn === team.player }"
        >
          <div class="flex row">
            <clix-card v-for="clix in team.roster" 
              :clix="clix.clix" 
              :clixStatus="clix"
              :takeDamage="takeDamage(clix, team)"
              :heal="heal(clix, team)"
            >
            </clix-card>
          </div>
        </md-tab>
      </md-tabs>
    </div>
  </div>
</template>

<script>
  import isNil from 'lodash/isNil';
  import ClixCard from '../widgets/ClixCard';
  import GoHome from '../widgets/GoHome';

  export default {
    name: 'game-view',
    components: {
      ClixCard,
      GoHome
    },
    props: {
      gameId: String
    },
    data: function() {
      return {
        game: null,
        crumbs: [{
          link: '/gamebox',
          label: 'Game Box'
        }, {
          link: `/game/${this.gameId}`,
          label: 'Game'
        }]
      };
    },
    computed: {
      gameName: function() {
        return isNil(this.game) ? 'Loading' : this.game.name;
      }
    },
    methods: {
      takeDamage: function(clix, team) {
        return () => {
          if (clix.onClick > clix.clix.clix.length) {
            return;
          }

          clix.onClick = clix.onClick + 1;
          const clixIndex = team.roster.findIndex((c) => {
            return c.clix._id === clix.clix._id;
          });

          this.$set(team.roster, clixIndex, clix);

          this.saveGame();
        };
      },
      heal: function(clix, team) {
        return () => {
          if (clix.onClick === 1) {
            return;
          }

          clix.onClick = clix.onClick - 1;
          const clixIndex = team.roster.findIndex((c) => {
            return c.clix._id === clix.clix._id;
          });

          this.$set(team.roster, clixIndex, clix);

          this.saveGame();
        };
      },
      saveGame: function() {
        this.updateGame(this.game, this.gameId);
      }
    },
    mounted: function() {
      const load = async () => {

        const clixCache = await this.getAllClix();
        const tempGame = await this.getGame(this.gameId);
        tempGame.teams.forEach((team) => {
          team.roster.forEach((clix) => {
            const match = clixCache[clix.clix];
            clix.clix = match;
          });
        });

        this.game = tempGame;
        
      };

      load();
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .game-view {
    padding: 12px;
  }

  .active {
    position: absolute;
    top: 12px;
    right: 14px;
    width: 12px;
    height: 12px;
    background-color: $red;
    border-radius: 6px;
  }

  .clix-status {
    background-color: white;
  }

  .title {
    padding: 20px;
  }

</style>
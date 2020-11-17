<template>
  <div class="game-view flex column hidden">
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
              :takeDamage="takeDamage(clix)"
              :heal="heal(clix)"
            >
            </clix-card>
          </div>
        </md-tab>
      </md-tabs>
      <div class="long"/>
    </div>
  </div>
</template>

<script>
  import isNil from 'lodash/isNil';
  import ClixCard from '../widgets/ClixCard';

  export default {
    name: 'game-view',
    components: {
      ClixCard
    },
    props: {
      gameId: String
    },
    data: function() {
      return {
        game: null
      };
    },
    computed: {
      gameName: function() {
        return isNil(this.game) ? 'Loading' : this.game.name;
      }
    },
    methods: {
      takeDamage: function(clix) {
        return () => {

        };
      },
      heal: function(clix) {
        return () => {

        };
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

  .long {
    height: 1000px;
    background-color: green;
  }

  .title {
    padding: 20px;
  }

</style>
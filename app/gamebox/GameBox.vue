<template>
  <div class="gamebox">
    <go-home :crumbs="crumbs"></go-home>
    <div>
      <md-button class="md-icon-button md-primary" @click="create">
        <md-icon class="mycons mycons-plus"></md-icon>
        <md-tooltip>Create a new Game</md-tooltip>
      </md-button>
    </div>
    <md-table v-model="games" md-sort="name" md-sort-order="asc" md-card>
      <md-table-row slot="md-table-row" slot-scope="{item}" class="pointer" @click="goToGame(item._id)">
        <md-table-cell md-label="Name" md-sort-by="name">{{item.name}}</md-table-cell>
        <md-table-cell md-label="# of Players" md-sort-by="teams.length" md-numeric>{{item.teams.length}}</md-table-cell>
        <md-table-cell md-label="Actions">
          <div class="buttons flex row">
            <md-button class="md-icon-button md-primary" @click="editThis(item._id)">
              <md-icon class="mycons mycons-pencil"></md-icon>
            </md-button>
            <md-button class="md-icon-button md-primary" @click="deleteThis(item._id)">
              <md-icon class="mycons mycons-cancel-circle"></md-icon>
            </md-button>
          </div>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>

  import GoHome from '../widgets/GoHome';

  export default {
    components: {
      GoHome,
      
    },
    data: function() {
      return {
        games: [],
        crumbs: []
      };
    },
    mounted: function() {
      this.refresh();
    },
    methods: {
      refresh: function() {
        const fx = async () => {
          const games = await this.getGames();
          this.games = Object.keys(games).map((key) => {
            return games[key];
          });
        };

        fx();
      },
      goToGame: function(id) {
        this.$router.push(`/game/${id}`);
      },
      create: function() {
        this.$router.push('/gamebox/create');
      },
      editThis: function(id) {
        this.goToGame(id);
      },
      deleteThis: function(id) {
        const doIt = async () => {
          await this.deleteGame(id);
          this.refresh();
        };

        doIt();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .gamebox {
    padding: 12px;
    width: 100%;
  }

  .pointer {
    cursor: pointer;
  }
</style>
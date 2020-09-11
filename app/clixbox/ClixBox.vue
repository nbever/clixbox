<template>
  <div class="clixbox flex row">
    <md-dialog-confirm 
      :md-active.sync="deleteConfirm" 
      md-title="Confirm Delete"
      md-content="Are you sure you want to delete this?  There is no 'undo'."
      @md-confirm="reallyDeleteThis"
      @md-cancel=""
    >
    </md-dialog-confirm>
    <div class="search">
    </div>
    <div class="results">
      <go-home :crumbs="crumbs"></go-home>
      <div>
        <md-button class="md-icon-button md-primary" @click="create">
          <md-icon class="mycons mycons-plus"></md-icon>
          <md-tooltip>Add a new HeroClix</md-tooltip>
        </md-button>
      </div>
      <md-table v-model="clix" md-sort="name" md-sort-order="asc" md-card>
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Image" md-sort-by="image">
            <div class="image" :style="{backgroundImage: `url(/images/${item.image})`}">
            </div>
          </md-table-cell>
          <md-table-cell md-label="Name" md-sort-by="name">{{item.name}}</md-table-cell>
          <md-table-cell md-label="Cost" md-sort-by="cost" md-numeric>{{item.cost}}</md-table-cell>
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
  </div>
</template>

<script>
  import GoHome from '../widgets/GoHome';
  import isNil from 'lodash/isNil';

  export default {
    components: {
      GoHome
    },
    data: function() {
      return {
        clix: [],
        crumbs: [],
        deleteConfirm: false,
        deleteProposal: null
      };
    },
    computed: {
      confirmContent: function() {
        return isNil(this.deleteProposal) ?
          ''
          :
          `Are you sure you want to delete ${this.deleteProposal.name}?  There is no 'undo'.`;
      }
    },
    methods: {
      create: function() {
        this.$router.push('/create');
      },
      editThis: function(id) {
        this.$router.push(`/edit/${id}`);
      },
      clearDeletion: function() {
        this.deleteProposal = null;
      },
      deleteThis: function(id) {

        this.deleteConfirm = true;
        this.deleteProposal = this.clix.filter((c) => {
          return c._id === id;
        })[0];
      },
      reallyDeleteThis: function() {
        this.deleteConfirm = false;
        const idToDelete = this.deleteProposal._id;
        this.clearDeletion();

        const fx = async () => {
          await this.deleteClix(idToDelete);
          this.refresh();
        };

        fx();
      },
      refresh: function() {
        const doIt = async () => {
          const clix = await this.getAllClix();

          this.clix = Object.keys(clix).map((key) => {
            return clix[key];
          });
        };

        doIt();
      }
    },
    mounted: function(){
      this.refresh();
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .clixbox {
    height: 100%;
  }

  .search {
    background-color: $dark_gray;
    width: 150px;
    height: 100%;
  }

  .results {
    padding: 12px;
    width: 100%;
  }

  .image {
    background-repeat: no-repeat;
    background-size: contain;
    height: 50px;
    width: 50px;
  }
</style>
<template>
  <div class="clixbox flex row">
    <div class="search">
    </div>
    <div class="results">
      <go-home :crumbs="crumbs"></go-home>
      <div>
        <md-button class="md-icon-button md-primary" @click="create">
          <md-icon class="mycons mycons-plus"></md-icon>
        </md-button>
      </div>
      <div v-for="click in this.clix" :key="click._id">
        {{click.name}}
      </div>
    </div>
  </div>
</template>

<script>
  import GoHome from '../widgets/GoHome';

  export default {
    components: {
      GoHome
    },
    data: function(){
      return {
        clix: null,
        crumbs: []
      };
    },
    methods: {
      create: function() {
        this.$router.push('/create');
      }
    },
    mounted: function(){
      const doFunc = async () => {
          console.log('here');
          const clix = await this.getAllClix();
          this.clix = clix;
      };

      doFunc();
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
</style>
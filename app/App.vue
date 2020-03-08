<template>
  <div class="container">
    <md-dialog-alert :md-active.sync="$root.showError" :md-content="$root.error">
    </md-dialog-alert>
    <md-dialog :md-active.sync="$root.loading">
      <div class="loading">
        <div class="italic">Loading...</div>
        <md-progress-bar md-mode="query"></md-progress-bar>
      </div>
    </md-dialog>
    <title-bar></title-bar>
    <div class="body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import TitleBar from './TitleBar';

  export default {
    components: {
      TitleBar
    },
    mounted: function() {

      const init = async () => {
        await this.getEnhancement('1');
        await this.getAbility('1');
        await this.getKeyword('1');
      }

      init();
    }
  };
</script>

<style lang="scss" scoped>
  @import 'variables';

  .container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
  }

  .body {
    flex-grow: 1;
    flex-shrink: 1;
    background-color: $gray;
  }
</style>

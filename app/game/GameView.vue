<template>
  <div class="game-view">
  </div>
</template>

<script>
  export default {
    name: 'game-view',
    props: {
      gameId: String
    },
    data: function() {
      return {
        game: null
      };
    },
    mounted: function() {
      const load = async () => {
        this.game = await this.getGame(this.gameId);
      };

      load();
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../variables';

</style>
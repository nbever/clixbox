<template>
  <div class="choices flex row">
    <div class="icon-button"
      @click="goto('/clixbox')"
    >
      <div class="mycons mycons-board_game" 
        @mouseover="clix = true"
        @mouseleave="clix = false"
      >  
      </div>
      <div :class="{'icon-title': true, 'small-font': clix}">ClixBox</div>
    </div>
    <div class="icon-button"
      @click="goto('/gamebox')"
    >
      <div class="mycons mycons-package" @mouseover="game = true" @mouseleave="game = false"></div>
      <div :class="{'icon-title': true, 'small-font': game}">Games</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data: function() {
      return {
        clix: false,
        game: false
      }
    },
    methods: {
      goto: function(link) {
        this.$router.push(link);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import 'variables';

  .choices {
    justify-content: center;
    padding: 48px;
  }

  .small-font {
    font-size: 32px !important;
    bottom: 24px !important;
    color: white !important;
  }

  .mycons {
    position: absolute;
    top: 24px;
    left: 30px;
    transition: 0s;
  }

  .icon-title {
    font-size: 64px;
    position: absolute;
    bottom: 0px;
    width: 100%;
    text-align: center;
  }

  .icon-button {
    font-size: 300px;
    cursor: pointer;
    margin: 24px;
    color: $dark-gray;
    border-radius: 150px;
    width: 300px;
    height: 300px;
    position: relative;

    &:hover {
      background-color: $middle-gray;
      color: $gray;
    }
  }
</style>
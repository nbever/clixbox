<template>
  <div class="player-setup flex row">

    <div class="index">
      <div class="inner-index">
        {{index + 1}}
      </div>
    </div>

    <div class="text-field">
      <clix-text-field
        :value="player.name"
        placeholder="Player Name"
        type="text"
        label="Player Name"
        :keyup="nameChanged"
      >
      </clix-text-field>
    </div>

    <div class="number-field">
      <clix-text-field
        :value="player.handicap"
        label="Handicap"
        :keyup="handicapChanged"
        type="number"
        :inputProps="{min: 0, max: 999}"
      >
      </clix-text-field>
    </div>

  </div>
</template>

<script>

  import ClixTextField from '../widgets/ClixTextField';
  import clone from 'lodash/clone';

  export default {
    components: {
      ClixTextField
    },
    props: {
      player: Object,
      index: Number,
      onChange: Function
    },
    methods: {
      handicapChanged: function($e) {
        const cPlayer = clone(this.player);
        cPlayer.handicap = $e.target.value;
        this.onChange(cPlayer);
      },
      nameChanged: function($e) {
        const cPlayer = clone(this.player);
        cPlayer.name = $e.target.value;
        this.onChange(cPlayer);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .player-setup {
    align-items: baseline;
  }

  .index {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: $dark_gray;
    color: white;
    text-align: center;
  }

  .inner-index {
    color: white;
    font-size: 24px;
    font-weight: bolder;
    padding-top: 7px;
  }

  .number-field {
    width: 150px;
    padding: 12px;
  }

  .text-field {
    width: 400px;
    padding: 12px;
  }

</style>
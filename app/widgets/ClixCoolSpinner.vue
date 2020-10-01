<template>
  <div>
    <div class="cool-spinner flex">
      <md-button class="md-icon-button md-primary" @click="goDown">
        <md-icon class="mycons mycons-minus"></md-icon>
        <md-tooltip>{{minusTooltip}}</md-tooltip>
      </md-button>

      <div class="big-number">
        {{value}}
      </div>

      <md-button class="md-icon-button md-plain" @click="goUp">
        <md-icon class="mycons mycons-plus"></md-icon>
        <md-tooltip>{{addTooltip}}</md-tooltip>
      </md-button>
    </div>
    <div class="big-label">{{label}}</div>
  </div>
</template>

<script>
  import isNil from 'lodash/isNil';

  export default {
    name: 'clix-cool-spinner',
    props: {
      minusTooltip: {
        type: String,
        default: 'Decrement the value'
      },
      addTooltip: {
        type: String,
        default: 'Increment the value'
      },
      label: String,
      value: Number,
      min: {
        type: Number,
        default: 2
      },
      max: Number,
      onChange: Function
    },
    methods: {
      goDown: function($e) {
        const newValue = this.value - 1;

        if (!isNil(this.min) && newValue < this.min) {
          return;
        }

        this.onChange(newValue);
      },
      goUp: function($e) {
        const newValue = this.value + 1;

        if (!isNil(this.max) && newValue > this.max) {
          return;
        }

        this.onChange(newValue);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .big-number {
    font-size: 72px;
    font-weight: bolder;
    margin-top: 12px;
  }

  .big-label {
    font-size: 20px;
    padding-top: 12px;
  }
</style>
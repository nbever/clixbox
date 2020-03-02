<template>
  <div class="test">
    {{message}}
    <md-button class="md-primary">Click Me</md-button>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        message: 'Hello'
      }
    },
    mounted: function() {

      const waitonme = () => {
        return 'I waited';
      };

      const waiter = async () => {
        const value = await waitonme();
        alert(value);
      }

      waiter();
    }
  };
</script>

<style lang="scss" scoped>
  .main {
    color: red;
  }
</style>

<template>
  <div class="title-bar">
    <div class="logo">
    </div>
  </div>
</template>

<script>
export default {
  name: 'title-bar'
};
</script>

<style lang="scss" scoped>
.title-bar {
  width: 100%;
  text-align: center;
  height: 48px;
  background-color: black;
  flex-grow: 0;
  flex-shrink: 0;
}

.logo {
  background-image: url('/clixassets/HeroClix-Pill.png');
  width: 300px;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  margin: auto;
}
</style>
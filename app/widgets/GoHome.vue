<template>
  <div class="go-home flex row rounded">
    <div class="breadcrumb flex row rounded" @click="gohome">
      <md-icon class="mycons mycons-home2 md-mini md-dense"></md-icon>
      <div class="text">Home</div>
    </div>
    <div v-for="crumb in crumbs" class="next-link breadcrumb flex row rounded">
      <div class="arrow">&gt;</div>
      <div @click="goto(crumb.link)">{{crumb.label}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'go-home',
    methods: {
      gohome: function() {
        this.$router.push('/home');
      },
      goto: function(link) {
        this.$router.push(link);
      }
    },
    props: {
      crumbs: Array
    }
  }
</script>

<style lang="scss" scoped>
@import '../../variables';

.go-home {
  background-color: white;
  width: 100%;
  overflow: auto;
}

.arrow {
  padding: 8px;
}

.text {
  text-decoration: underline;
  padding: 4px;
}

.breadcrumb {
  align-items: center;
  cursor: pointer;
  padding: 4px;
  flex-grow: 0;
  flex-shrink: 0;

  &:hover {
    background-color: $middle_gray;
    color: white;
  }
}

.mycons {
  font-size: 16px;
}
</style>
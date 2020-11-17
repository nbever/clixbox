<template>
  <div class="clix-card">
    <div class="name">{{clix.name}}</div>

    <div class="container flex row">

      <div class="image-box grow">
        <div class="image grow" :style="{backgroundImage: `url(/images/${clix.image})`}">
        </div>
        <clicker 
          :click="currentClick" 
          :badges="badges"
          :takeDamage="takeDamage"
          :heal="heal"
        >
        </clicker>
      </div>

      <div class="stat-box">
        <div class="stat flex row" v-for="key in badgeKeys">
          <div class="action-badge">
            <md-icon :class="`hc ${getBadgeClass(key)}`"></md-icon>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import isNil from 'lodash/isNil';
  import Clicker from './Clicker';
  import {getBadge} from '../clixbox/resolvers';
  import {MOVE, ATTACK, DAMAGE, DEFEND} from '../../constants';

  export default {
    name: 'clix-card',
    props: {
      clix: Object,
      clixStatus: Object,
      takeDamage: Function,
      heal: Function
    },
    components: {
      Clicker
    },
    data: function() {
      return {
        badges: {},
        badgeKeys: [MOVE, ATTACK, DAMAGE, DEFEND],
        colors: {}
      };
    },
    computed: {
      currentClick: function() {
        return this.clix.clix[this.clixStatus.onClick - 1];
      }
    },
    methods: {
      getBadgeClass: function(key) {
        return isNil(this.badges[key]) ?
          ''
          :
          this.badges[key].iconClass;
      }
    },
    mounted: function() {
      const doIt = async () => {
        for (let i = 0; i < this.badgeKeys.length; i++) {
          const key = this.badgeKeys[i];
          const badge = await getBadge(this.clix, key, this);
          this.$set(this.badges, key + '', badge);
        }
      }

      doIt();
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .clix-card {
    margin: 8px;
    padding: 8px;
    border: 1px solid $light-gray;
    border-radius: 6px;
    min-height: 290px
  }

  .image {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .image-box {
    width: 200px;
    height: 150px;
  }

  .stat-box {
    padding-left: 8px;
  }
</style>
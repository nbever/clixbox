<template>
  <div class="padding" v-if="value !== null">
    <md-menu md-size="auto">
      <div md-menu-trigger>
        <div class="clicker rounded">
          <div>
            <md-icon :class="`hc ${value.iconClass}`"></md-icon>
          </div>
          <div>{{value.label}} &#x25BC;</div>
        </div>
      </div>
      
      <md-menu-content>
        <md-menu-item v-for="badge in badges" 
          value="badge.id" class="flex row item"
          @click="onChange(badge)"
        >
          <md-icon :class="`hc ${badge.iconClass}`"></md-icon>
          {{badge.label}}
        </md-menu-item>
      </md-menu-content>
    </md-menu>
  </div>
</template>

<script>
  import isNil from 'lodash/isNil';

  const doKeywords = async function(context, badges) {
    context.keywords.forEach(async (k) => {
      const keyword = await context.getKeywordByName(k);
      badges.push({
        id: keyword._id,
        label: keyword.term,
        iconClass: `hc-icon-${keyword.term.toLowerCase()}`
      });
    });
  };

  export default {
    name: 'base-enhancement-combo',
    props: {
      value: {
        id: String,
        label: String,
        iconClass: String
      },
      keywords: Array,
      customBadges: Array,
      defaultBadge: {
        id: String,
        label: String,
        iconClass: String
      },
      onChange: Function
    },
    data: function() {
      return {
        badges: []
      }
    },
    mounted: function() {
      const fx = async () => {

        const badges = [this.defaultBadge];

        if (!isNil(this.keywords)) {
          await doKeywords(this, badges);
        }
        else {
          this.customBadges.forEach((cb) => {
            badges.push(cb);
          })
        }

        this.badges = badges;
        this.onChange(this.badges[0]);
      };

      fx();      
    }
  }
</script>

<style lang="scss" scoped>
@import '../../variables';

.item {
  cursor: pointer;

  &:hover {
    background-color: $gray;
  }
}

.padding {
  padding-right: 12px;
}

.clicker {
  text-align: center;
  transition: 200ms;
  padding: 4px;
  cursor: pointer;

  &:hover {
    background-color: $gray;
  }
}
</style>
<template>
  <div class="keyword-builder flex row">
    <div v-for="(keyword, index) in keywordList"
      class="keyword"
    >
      <div class="flex row">
        <div class="chosen-text">{{keyword.term}}</div>
        <div v-if="keyword.value !== undefined">
          {{keyword.value}}
        </div>
      </div>

      <div class="delete mycons-cancel-circle" @click="deleteKeyword(index)">
      </div>

      <div>
        <md-menu md-size="auto">
          <div md-menu-trigger class="clicker">
            &#x25BC;
          </div>

          <md-menu-content>
            <md-menu-item v-for="option in menuItems" 
              class="menu-item"
              @click="keywordChanged(option, index)"
            >
              <div>
                <div class="keyword-title">
                  {{option.term}}
                </div>
                <div class="little-text">
                  {{option.text}}
                </div>
              </div>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>

    </div>
    <div class="add-keyword">
      <md-button class="md-icon-button"
        @click="newKeyword"
      >
        <md-icon class="myicons mycons-plus"></md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
  import isNil from 'lodash/isNil';

  export default {
    name: 'keyword-builder',
    props: {
      category: String,
      keywordList: Array,
      addKeyword: Function,
      changeKeyword: Function,
      removeKeyword: Function
    },
    data: function() {
      return {
        keywords: []
      };
    },
    computed: {
      menuItems: function() {
        return this.getAvailableKeywords();
      }
    },
    methods: {
      deleteKeyword: function(index) {
        this.removeKeyword(index);
      },
      newKeyword: function() {
        const availableValues = this.getAvailableKeywords();
        this.addKeyword(availableValues[0]);
      },
      keywordChanged: function(keyword, index) {
        this.changeKeyword(index, keyword);
      },
      getAvailableKeywords: function() {
        return this.keywords
          .filter((a) => {
            const match = this.keywordList.find((al) => {
              return al._id === a._id;
            });

            return isNil(match);
          });
      }
    },
    mounted: function() {
      const fx = async () => {
        const keywordObj = await this.getKeywords();
        this.keywords = Object.values(keywordObj);
      };

      fx();
    }
  };
</script>

<style lang="scss" scoped>
@import '../../variables';

.keyword {
  position: relative;
}

.center {
  align-items: center;
}

.delete {
  position: absolute;
  top: 4px;
  font-size: 12px;
  left: 0px;
  background-color: white;
  cursor: pointer;
  border-radius: 10px;
  padding: 1px;

  &:hover {
    background-color: $gray;
  }
}

.keyword-title {
  font-weight: bolder;
  text-transform: capitalize;
  font-size: 12px;
}

.little-text {
  font-size: 10px;
  white-space: normal !important;
}

.chosen-text {
  font-size: 10px;
  color: $dark-gray;
  padding-right: 16px;
  padding-left: 16px;
}

.menu-item {
  cursor: pointer;

  &:hover {
    background-color: $gray;
  }
}

.clicker {
  font-size: 14px;
  position: absolute;
  bottom: 18px;
  right: 4px;
  cursor: pointer;
}

.orb {
  position: relative;
  width: 48px;
  height: 48px;
  font-size: 32px;
  padding: 8px;
}

.orb-small {
  position: relative;
  width: 24px;
  height: 24px;
  font-size: 28px;
  padding: 12px;
}

.border {
  border: 1px solid $middle_gray;
  border-radius: 26px;
  margin-right: 16px;
}
</style>
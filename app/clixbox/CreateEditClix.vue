<template>
  <div>
    <div class="padder">
      <go-home :crumbs="links" />
    </div>
    <div class="form">
      <div class="title">Add a Clix</div>
      <div class="fields rounded form">
        <div class="flex row">
          <clix-text-field 
            class="field"
            label="Name"
            :value="clix.name"
            :keyup="change('name')"
          >
          </clix-text-field>
          <clix-text-field
            class="field"
            label="Model #"
            :value="clix.model"
            :keyup="change('model')"
          >
          </clix-text-field>
          <clix-text-field
            class="field"
            label="Team"
            :value="clix.release"
            :keyup="change('release')"
          >
          </clix-text-field>
        </div>

        <div class="flex row">
          <clix-text-field
            class="field small"
            label="Cost"
            :value="clix.cost"
            :keyup="change('cost')"
            type="number"
            :inputProps="{min: '0', max: '1000'}"
          >
          </clix-text-field>
          <base-enhancement-combo
            :value="badgeKeywords.move"
            :onChange="badgeSelected('move')"
            :keywords="moveKeywords"
            :defaultBadge="{id: '0', label: '(Standard)', iconClass: 'hc-icon-move'}"
          >
          </base-enhancement-combo>

          <base-enhancement-combo
            :value="badgeKeywords.range"
            :onChange="badgeSelected('range')"
            :customBadges="attackBadges"
            :defaultBadge="{id: '0', label: '(Standard)', iconClass: 'hc-icon-attack'}"
          >
          </base-enhancement-combo>

          <clix-text-field
            v-if="showRangeField"
            class="field small"
            label="Range"
            :value="clix.range"
            :keyup="change('rangeTargets')"
            type="number"
            :inputProps="{min: 0, max: 10}"
          >
          </clix-text-field>

          <base-enhancement-combo
            :value="badgeKeywords.defense"
            :onChange="badgeSelected('defense')"
            :keywords="defenseKeywords"
            :defaultBadge="{id: '0', label: '(Standard)', iconClass: 'hc-icon-defend'}"
          >
          </base-enhancement-combo>
          <base-enhancement-combo
            :value="badgeKeywords.damage"
            :onChange="badgeSelected('damage')"
            :customBadges="damageBadges"
            :defaultBadge="{id: '0', label: '(Standard)', iconClass: 'hc-icon-damage'}"
          >
          </base-enhancement-combo>
        </div>

        <div class="flex row">
          <enhancement-setter
            :enhancements="currentMoveEnhancements"
            :possibleEnhancements="moveEnhancements"
            :enhancementChanged="moveEnhancementChanged"
            categoryClass="hc hc-icon-run"
          >
          </enhancement-setter>
        </div>
        <div class="flex row">
          <enhancement-setter
            :enhancements="currentTargetEnhancements"
            :possibleEnhancements="targetEnhancements"
            :enhancementChanged="targetEnhancementChanged"
            categoryClass="hc hc-icon-target"
          >
          </enhancement-setter>
        </div>

        <div class="flex row">
          <click-builder 
            :clicks="clicks"
            :clicksChanged="clicksChanged"
            :moveBadge="badgeKeywords.move"
            :attackBadge="badgeKeywords.range"
            :defenseBadge="badgeKeywords.defense"
            :damageBadge="badgeKeywords.damage"
          >
          </click-builder>
        </div>

        <div class="flex row">
          <custom-abilities
            :moveBadge="badgeKeywords.move"
            :attackBadge="badgeKeywords.range"
            :defenseBadge="badgeKeywords.defense"
            :damageBadge="badgeKeywords.damage"
            :customAbilities="customAbilities"
            :onChange="customAbilitiesChanged"
          >
          </custom-abilities>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import GoHome from '../widgets/GoHome';
  import ClixTextField from '../widgets/ClixTextField';
  import BaseEnhancementCombo from '../widgets/BaseEnhancementCombo';
  import EnhancementSetter from '../widgets/EnhancementSetter';
  import ClickBuilder from '../widgets/ClickBuilder';
  import CustomAbilities from './CustomAbilities';
  import {
    SWIM,
    FLIGHT,
    MOVE,
    TARGET,
    INDOMITABLE,
    GRAY,
    GIANT_REACH,
    GREAT_SIZE,
    COLOSSAL_STAMINA
  } from '../../constants';

  import isNil from 'lodash/isNil';
  import clone from 'lodash/clone';

  const ID_TINY = 'tiny';
  const ID_LARGE = 'large';
  const ID_COLOSSAL = 'colossal';

  const keywordsToEnhancements = async (badgeKeywords, enhancements, api) => {

    const fixedKeywords = await Promise.all(Object.values(badgeKeywords).map(async (bVal) => {

      if (isNil(bVal)) {
        return bVal;
      }

      const enhancementList = isNil(bVal.enhancements) ?
        [] : bVal.enhancements;

      if (bVal.id === ID_LARGE || bVal.id === ID_COLOSSAL) {
        const size = await api.getKeywordByName(GREAT_SIZE);
        const reach = await api.getKeywordByName(GIANT_REACH);
        enhancementList.push(...size.enhancements, ...reach.enhancements);
      }

      if (bVal.id === ID_COLOSSAL) {
        const stamina = await api.getKeywordByName(COLOSSAL_STAMINA);
        enhancementList.push(...stamina.enhancements);
      }

      return {
        ...bVal,
       enhancements: enhancementList 
      };
    }));

    const requiredList = await Promise.all(Object.values(fixedKeywords)
      .filter((val) => {
        if (isNil(val) || isNil(val.enhancements) || val.enhancements.length ===0) {
          return false;
        }
        return true;
      })
      .reduce((list, enhancementList) => {
        const uniqueOnes = enhancementList.enhancements.filter((newE) => {
          const dupe = list.find((listItem) => {
            return newE === listItem;
          });

          return isNil(dupe);
        });

        list.push(...uniqueOnes);

        return list;
      }, [])
      .map(async (liteE) => {
        const alreadyGrabbed = enhancements.find((fullE) => {
          return liteE === fullE._id;
        });

        if (!isNil(alreadyGrabbed)) {
          return alreadyGrabbed;
        }

        const newAndFulle = await api.getEnhancement(liteE);
        return newAndFulle;
      }));

    return requiredList;
  };

  const rationalizeEnhancementList = async (requiredList, enhancements) => {

    const lockedEnhancements = requiredList.map((lockMe) => {
        const c = clone(lockMe);
        c.locked = true;
        return c;
      });

    const oldEnhancements = enhancements
      .filter((oldE) => {
        const isItLocked = lockedEnhancements.find((lE) => {
          return lE._id === oldE._id;
        });

        if (!isNil(isItLocked)) {
          return false;
        }

        return true;
      })
      .map((leftover) => {
        const c = clone(leftover);
        c.locked = false;
        return c;
      });

    const fullList = [...lockedEnhancements, ...oldEnhancements];
    return fullList;
  };

  export default {
    components: {
      GoHome,
      ClixTextField,
      BaseEnhancementCombo,
      EnhancementSetter,
      ClickBuilder,
      CustomAbilities
    },
    computed: {
      showRangeField: function() {
        return !isNil(this.badgeKeywords.range) &&
          (this.badgeKeywords.range.id === '2' ||
            this.badgeKeywords.range.id === '3' ||
            this.badgeKeywords.range.id === '4');
      },
      moveKeywords: function() {
        return [SWIM, FLIGHT];
      },
      defenseKeywords: function() {
        return [INDOMITABLE];
      },
      attackBadges: function() {
        return [
          {id: '1', label: 'Double', iconClass: 'hc-icon-double-fist'},
          {id: '2', label: 'Range', iconClass: 'hc-icon-range'},
          {id: '3', label: 'Multi-Range', iconClass: 'mycons-2-bolts'},
          {id: '4', label: 'Triple-Range', iconClass: 'mycons-3-bolts'}
        ];
      },
      moveEnhancements: function() {
        return this.possibleEnhancements.filter((pe) => {
          return pe.type === MOVE;
        });
      },
      targetEnhancements: function() {
        return this.possibleEnhancements.filter((pe) => {
          return pe.type === TARGET;
        })
      },
      damageBadges: function() {
        return [
          {id: ID_TINY, label: 'Tiny', iconClass: 'hc-icon-tiny'},
          {id: ID_LARGE, label: 'Large', iconClass: 'hc-icon-large'},
          {id: ID_COLOSSAL, label: 'Colossal', iconClass: 'hc-icon-colossal'}
        ];
      },
      currentMoveEnhancements: function() {
        return this.enhancements.filter((e) => {
          return e.type === MOVE;
        });
      },
      currentTargetEnhancements: function() {
        return this.enhancements.filter((e) => {
          return e.type === TARGET;
        });
      }
    },
    data: function() {
      return {
        links: [
          {link: '/clixbox', label: 'Clix Box'}
        ],
        clix: {
          name: '',
          model: '',
          release: '',
          cost: 50,
          range: 0,
          rangeTargets: 0
        },
        badgeKeywords: {
          move: null,
          defense: null,
          damage: null,
          range: null
        },
        clicks: [],
        enhancements: [],
        possibleEnhancements: [],
        customAbilities: []
      };
    },
    mounted: function() {
      const fx = async () => {
        const allEns = await this.getEnhancements();
        this.possibleEnhancements = Object.values(allEns);
      };

      fx();
    },
    methods: {
      change: function(key) {
        return ($e) => {
          this.clix[key] = $e.target.value;
        }
      },
      badgeSelected: function(key) {
        return async (keyword) => {
        
          this.badgeKeywords[key] = keyword;

          const keywordsEnhancements = await keywordsToEnhancements(
            this.badgeKeywords, this.enhancements, this);
          this.enhancements = await rationalizeEnhancementList(
            keywordsEnhancements, this.enhancements);
        }
      },
      moveEnhancementChanged: function(enhancements) {
        const keepers = this.enhancements.filter((realE) => {
          return realE.type === TARGET;
        });

        this.enhancements = [...keepers, ...enhancements];
      },
      targetEnhancementChanged: function(enhancements) {
        const keepers = this.enhancements.filter((realE) => {
          return realE.type === MOVE;
        });

        this.enhancements = [...keepers, ...enhancements];
      },
      clicksChanged: function(newClicks) {

        const fx = async () => {
          const enhancementList = await Promise.all(newClicks.reduce((list, c) => {
            
            const getList = (prop) => {
              return !isNil(c[prop].ability) ?
                c[prop].ability.enhancements : [];
            };

            const full = [
              ...getList('move'),
              ...getList('attack'),
              ...getList('defend'),
              ...getList('damage')
            ];

            return list.concat(full);
          }, [])
          .map(async (e) => {
            const fullE = await this.getEnhancement(e);
            return fullE;
          }));

          this.clicks.splice(0, this.clicks.length, ...newClicks);
          this.enhancements = await rationalizeEnhancementList(enhancementList,
            this.enhancements, this);
        };

        fx();
      },
      customAbilitiesChanged: function(customAbilities) {
        this.customAbilities = customAbilities;
      }
    }
  }
</script>

<style lang="scss" scoped>
.padder {
  padding: 8px;
}

.field {
  margin-right: 12px;

  &.small {
    width: 50px;
  }
}

.fields {
  background-color: white;
}
</style>
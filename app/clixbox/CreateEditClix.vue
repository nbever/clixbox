<template>
  <div class="root-editor">

    <md-dialog-alert 
      :md-active.sync="cannotSave"
      md-title="Error"
      md-content="Name, Cost and Clix must be defined in order to save."
    >
    </md-dialog-alert>


    <div class="padder">
      <go-home :crumbs="links" />
    </div>
    <div class="form flex column hidden">
      <div class="title">Add a Clix</div>
      <div class="fields rounded form auto">
        <div class="flex row">
          <clix-text-field 
            class="field"
            label="Name"
            :value="clix.name"
            :keyup="change('name')"
          >
          </clix-text-field>
        </div>
        <div class="flex row">
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
          <image-saver placeholder="Upload an image of the new HeroClix" :imageName="imageChanged">
          </image-saver>
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
            :keyup="change('range')"
            :click="change('range')"
            type="number"
            :inputProps="{min: 2, max: 10}"
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
            :canAdd="false"
          >
          </enhancement-setter>
        </div>
        <div class="flex row">
          <enhancement-setter
            :enhancements="currentTargetEnhancements"
            :possibleEnhancements="targetEnhancements"
            :enhancementChanged="targetEnhancementChanged"
            categoryClass="hc hc-icon-target"
            :canAdd="false"
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
      <div class="buttons">
        <md-button class="md-raised" @click="pageSaveClix">Save</md-button>
        <md-button class="" @click="cancelClixCreation">Cancel</md-button>
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
  import ImageSaver from '../widgets/ImageSaver';
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
    COLOSSAL_STAMINA,
    DEFEND,
    DAMAGE,
    ATTACK,
    TINY,
    ALL
  } from '../../constants';

  import {ALWAYS} from '../widgets/TypeDropDown';

  import isNil from 'lodash/isNil';
  import clone from 'lodash/clone';

  const ID_TINY = 'tiny';
  const ID_LARGE = 'large';
  const ID_COLOSSAL = 'colossal';

  import {rationalizeEnhancementList, keywordsToEnhancements, getBadge}
    from './resolvers';

  export default {
    name: 'create-edit-clix',
    components: {
      GoHome,
      ClixTextField,
      BaseEnhancementCombo,
      EnhancementSetter,
      ClickBuilder,
      CustomAbilities,
      ImageSaver
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
          image: '',
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
        customAbilities: [],
        cannotSave: false
      };
    },
    props: {
      clixIdToEdit: String
    },
    mounted: function() {
      const fx = async () => {
        const allEns = await this.getEnhancements();
        this.possibleEnhancements = Object.values(allEns);

        if (!isNil(this.clixIdToEdit)) {
          const clix = await this.getClix(this.clixIdToEdit);
          this.clix = {
            name: clix.name,
            model: clix.model,
            cost: clix.cost,
            release: clix.release,
            image: clix.image,
            range: clix.range,
            rangeTargets: clix.rangeTargets
          };

          const moveBadge = await getBadge(clix, MOVE, this);
          const defendBadge = await getBadge(clix, DEFEND, this);
          const rangeBadge = await getBadge(clix, ATTACK, this);
          const damageBadge = await getBadge(clix, DAMAGE, this);

          this.badgeKeywords[MOVE.toLowerCase()] = moveBadge;
          this.badgeKeywords['defense'] = defendBadge;
          this.badgeKeywords['range'] = rangeBadge;
          this.badgeKeywords[DAMAGE.toLowerCase()] = damageBadge;

          this.customAbilities = 
            await Promise.all(clix.customAbilities.map(async (ca) => {
              ca.badge = ca.category === ALL ?
                ALWAYS 
                : 
                ca.category === ATTACK ?
                  this.badgeKeywords['range']
                  :
                  this.badgeKeywords[ca.category.toLowerCase()];
                  
              ca.abilities = await Promise.all(ca.abilities.map( async (ability) => {
                const newAbility = await this.getAbility(ability._id);
                return newAbility;
              }));

              ca.keywords = await Promise.all(ca.keywords.map( async (keyword) => {
                const newWord = await this.getKeyword(keyword._id);
                return newWord;
              }));

              ca.enhancements = await Promise.all(ca.enhancements.map(async (enhance) => {
                const newE = await this.getEnhancement(enhance);
                return newE;
              }));

              return ca;
            }));

          this.enhancements = clix.enhancements;
          this.clicks = await Promise.all(clix.clix.map(async (clickRow) => {
            Object.keys(clickRow).forEach(async (key) => {
              if (isNil(clickRow[key].ability)) {
                return;
              }

              clickRow[key].ability = await this.getAbility(clickRow[key].ability);

              if (clickRow[key].ability.action === 'CUSTOM') {
                clickRow[key].ability._id = 'CUST';
              }
            });

            return clickRow;
          }));

          await this.badgeSelected(MOVE.toLowerCase())(moveBadge);
        }
      };

      fx();
    },
    methods: {
      change: function(key) {
        return ($e) => {
          this.clix[key] = $e.target.value;
        }
      },
      imageChanged: function(name) {
        this.clix.image = name;
      },
      badgeSelected: function(key) {
        return async (keyword) => {
        
          this.badgeKeywords[key] = keyword;

          if (key === 'range') {
            this.clix.range = parseInt(keyword.id) > 1 ?
              6 : 0;
          }

          const keywordsEnhancements = await keywordsToEnhancements(
            this.badgeKeywords, this.enhancements, this);
          const locked = keywordsEnhancements.map((e) => {
            const lEn = clone(e);
            lEn.locked = true;
            return lEn;
          });
          this.enhancements = locked;
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
                !isNil(c[prop].ability.enhancements) ?
                  c[prop].ability.enhancements 
                  : 
                  []
                :
                [];
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
          this.enhancements = await rationalizeEnhancementList(
            this.enhancements, enhancementList, this);
        };

        fx();
      },
      customAbilitiesChanged: function(customAbilities) {
        this.customAbilities = customAbilities;
      },
      pageSaveClix: function() {
        const doIt = async () => {
          const valid = (key) => {
            return !isNil(this.clix[key]) || this.clix[key].trim().length > 0;
          };

          if (!valid('name') || !valid('cost') || this.clicks.length <= 0) {
            this.cannotSave = true;
            return;
          }

          const attackBadgeId = parseInt(this.badgeKeywords.range.id);

          const keywords = [];
          const K_TINY = await this.getKeywordByName(TINY);
          const K_GREAT_SIZE = await this.getKeywordByName(GREAT_SIZE);
          const K_GIANT_REACH = await this.getKeywordByName(GIANT_REACH);
          const K_COLOSSAL = await this.getKeywordByName(COLOSSAL_STAMINA);
          const K_INDOMITABLE = await this.getKeywordByName(INDOMITABLE);

          if (this.badgeKeywords['damage'].id === ID_TINY) {
            keywords.push(K_TINY);
          }

          if (this.badgeKeywords['damage'].id === ID_LARGE ||
            this.badgeKeywords['damage'].id === ID_COLOSSAL) {
            keywords.push(K_GREAT_SIZE);
            keywords.push(K_GIANT_REACH);
          }

          if (this.badgeKeywords['damage'].id === ID_COLOSSAL) {
            keywords.push(K_COLOSSAL);
          }

          if (!isNil(this.badgeKeywords['defense'].term)) {
            keywords.push(this.badgeKeywords['defense']);
          }

          if (!isNil(this.badgeKeywords['move'].term)) {
            keywords.push(this.badgeKeywords['move']);
          }

          const saver = {
            ...this.clix,
            rangeTargets: attackBadgeId === 1 || attackBadgeId === 3 ? 2 :
              attackBadgeId === 4 ? 3 : 1, 
            customAbilities: this.customAbilities,
            keywords: keywords,
            enhancements: this.enhancements,
            clix: this.clicks
          };

          if (isNil(this.clixIdToEdit)) {
            await this.saveClix(saver, (result) => {
              this.$router.push('/clixbox');  
            });
          }
          else {
            await this.updateClix(saver, this.clixIdToEdit, (result) => {
              this.$router.push('/clixbox');
            });
          }
        };

        doIt();
      },
      cancelClixCreation: function() {
        this.$router.push('/clixbox');
      }
    }
  }
</script>

<style lang="scss" scoped>
.root-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.padder {
  padding: 8px;
}

.field {
  margin-right: 24px;
  &.small {
    width: 50px;
  }
}

.fields {
  background-color: white;
  text-align: center;
  padding-left: 24px;
  margin-right: 24px;
}
</style>
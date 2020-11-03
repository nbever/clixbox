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
  TINY,

  SPEED,
  DEFEND,
  DAMAGE,
  ATTACK
} from '../../constants';

import isNil from 'lodash/isNil';
import clone from 'lodash/clone';

const ID_TINY = 'tiny';
const ID_LARGE = 'large';
const ID_COLOSSAL = 'colossal';  

export const keywordsToEnhancements = async (badgeKeywords, enhancements, api) => {

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

  const rList = await createRequiredList(fixedKeywords, enhancements, api);
  return rList;
};

export const createRequiredList = async (items, enhancements, api) => {

  const requiredList = await Promise.all(Object.values(items)
    .filter((val) => {
      if (isNil(val) || isNil(val.enhancements) || val.enhancements.length === 0) {
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

export const rationalizeEnhancementList = async (requiredList, enhancements) => {

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

export const getBadge = async (clix, category, api) => {

  const hasKeyword = async (keywordName) => {

    const keyword = await api.getKeywordByName(keywordName);

    const result = clix.keywords.find((cK) => {
      return cK.keyword === keyword._id;
    });

    return !isNil(result) ? keyword : null;
  };


  if (category === MOVE) {
    const hasSwim = await hasKeyword(SWIM);

    if (!isNil(hasSwim)) {
      return { 
        id: hasSwim._id, 
        label: hasSwim.term, 
        iconClass: `hc-icon-${hasSwim.term.toLowerCase()}`
      };
    }

    const hasFlight = await hasKeyword(FLIGHT);

    if (!isNil(hasFlight)) {
      return {
        id: hasFlight._id,
        label: hasFlight.term,
        iconClass: `hc-icon-${hasFlight.term.toLowerCase()}`
      };
    }

    return {
      id: '0',
      label: '(Standard)',
      iconClass: `hc-icon-move`
    };
  }

  if (category === ATTACK) {
    if (clix.rangeTargets > 0 && clix.range === 0) {
      return {
        id: '1',
        label: 'Double',
        iconClass: 'hc-icon-double-fist'
      };
    }
    else if (clix.range > 0 && clix.rangeTargets === 1) {
      return {
        id: '2',
        label: 'Range',
        iconClass: 'hc-icon-range'
      };
    }
    else if (clix.range > 0 && clix.rangeTargets === 2) {
      return {
        id: '3',
        label: 'Multi-Range',
        iconClass: 'mycons-2-bolts'
      };
    }
    else if (clix.range > 0 && clix.rangeTargets === 3) {
      return {
        id: '4',
        label: 'Triple-Range',
        iconClass: 'mycons-3-bolts'
      };
    }

    return {
      id: '0',
      label: '(Standard)',
      iconClass: 'hc-icon-attack'
    };
  }

  if (category === DEFEND) {
    const hasIndominitable = await hasKeyword(INDOMITABLE);

    if (!isNil(hasIndominitable)) {
      return {
        id: hasIndominitable._id,
        label: hasIndominitable.term,
        iconClass: 'hc-icon-indomitable'
      };
    }

    return {
      id: '0',
      label: '(Standard)',
      iconClass: 'hc-icon-defend'
    };
  }

  if (category === DAMAGE) {
    const hasTiny = await hasKeyword(TINY);

    if (!isNil(hasTiny)) {
      return {
        id: ID_TINY,
        label: 'Tiny',
        iconClass: 'hc-icon-tiny'
      };
    }

    const hasGreatSize = await hasKeyword(GREAT_SIZE);
    const hasGiantReach = await hasKeyword(GIANT_REACH);
    const hasColossal = await hasKeyword(COLOSSAL_STAMINA);

    if (!isNil(hasColossal)) {
      return {
        id: ID_COLOSSAL,
        label: 'Colossal',
        iconClass: 'hc-icon-colossal'
      };
    }

    if (!isNil(hasGiantReach) && !isNil(hasGreatSize)) {
      return {
        id: ID_LARGE,
        label: 'Large',
        iconClass: 'hc-icons-large'
      };
    }

    return  {
      id: '0',
      label: '(Standard)',
      iconClass: 'hc-icon-damage'
    };
  }

};
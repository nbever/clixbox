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
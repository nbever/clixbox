const S = require('../constants');

const enhancements = [
  {
    type: S.MOVE,
    color: S.RED,
    text: 'This character can move up or down across Elevated Terrain (without using elevation change square)'
  },
  {
    type: S.MOVE,
    color: S.GREEN,
    text: 'This character does not stop moving when moving into terrain that is hindering for movement purposes and does not halve its speed value when beginning movement from terrain that is hindering for movement purposes.'
  },
  {
    type: S.MOVE,
    color: S.LIGHT_BLUE,
    text: 'This character does not stop moving when moving into Water terrain and does not halve its speed value when beginning movement from Water terrain.'
  },
  {
    type: S.MOVE,
    color: S.BROWN,
    text: 'This character can move through Blocking terrain.'
  },
  {
    type: S.MOVE,
    color: S.BROWN,
    icon: S.RING,
    text: 'This character can move through Outdoor blocking terrain'
  },
  {
    type: S.MOVE,
    color: S.BROWN,
    icon: S.DAMAGE,
    text: 'This character can move through Blocking terrain.  Immediately after movement resolves, destroy all Blocking terrain moved through.'
  },
  {
    type: S.MOVE,
    color: S.GRAY,
    icon: S.DOT,
    text: 'This character can move through squares adjacent to or occupied by opposing characters without stopping, and automatically breaks away, even if adjacent to a character that can use Plasticity.'
  },
  {
    type: S.MOVE,
    color: S.GRAY,
    icon: S.INF,
    text: 'This character can move through squares adjacent to or occupied by opposing characters without stopping.  (Still needs to breakaway).'
  },
  {
    type: S.TARGET,
    color: S.RED,
    text: 'Lines of fire drawn by this character are not blocked by Elevated terrain.'
  },
  {
    type: S.TARGET,
    color: S.GREEN,
    text: 'Lines of fire drawn by this character can\'t be hindered.'
  },
  {
    type: S.TARGET,
    color: S.BROWN,
    text: 'Lines of fire drawn by this character are not blocked by Blocking terrain.'
  },
  {
    type: S.TARGET,
    color: S.BROWN,
    icon: S.DAMAGE,
    text: 'Once per ranged attack, this character can draw a line of fire through one piece of Blocking terrain.  Immediately after the attack resolves, destroy that piece of Blocking terrain.'
  },
  {
    type: S.TARGET,
    color: S.GRAY,
    icon: S.DOT,
    text: 'Lines of fire drawn by this character are not blocked by characters.'
  },
  {
    type: S.TARGET,
    color: S.GRAY,
    icon: S.INF,
    text: 'This character can make renage attacks while adjacent to opposing characters.  (May target adjacent or non-adjacent opposing characters.)'
  }
];

const keywords = [
  {
    term: S.EVADE,
    text: 'The attack misses this character instead of hitting it.'
  },
  {
    term: S.PASSENGER,
    text: 'This character can use the Carry ability to carry up to {} characters, including characters that are the same size that don\'t have FLIGHT'
  },
  {
    term: S.FLIGHT,
    text: '',
    enhancements: [
      `${S.MOVE}-${S.RED}`,
      `${S.MOVE}-${S.GREEN}`,
      `${S.MOVE}-${S.BROWN}-${S.RING}`,
      `${S.MOVE}-${S.GRAY}-${S.INF}`
    ],
    keywords: [
      {keyword: S.PASSENGER, value: 1}
    ],
    abilities: []
  },
  {
    term: S.INDOMITABLE,
    text: 'This character can use Willpower',
    abilities: [
      {category: S.DEFENSE, action: S.WILLPOWER}
    ],
    keywords: [],
    enhancements: []
  },
  {
    term: S.COLOSSAL_STAMINA,
    text: 'This character can be given a costed action even if it has two action tokens, and does not receive an action token for that action.  After resolutions, deal it 1 unavoidable damage and don\'t clear its action tokens this turn.',
    keywords: [],
    abilities: [],
    enhancements: []
  },
  {
    term: S.GIANT_REACH,
    text: 'When this character makes a close attack, instead of choosing an adjacent character (or characters) for target(s), you may use target characters within {} squares and line of fire.',
    keywords: [],
    abilities: [],
    enhancements: [
      `${S.TARGET}-${S.GREEN}`
    ]
  },
  {
    term: S.GREAT_SIZE,
    text: 'Lines of fire drawn to or from this character are not blocked by Elevated terrain or another Blocking terrain, and are hindered only if the line of fire is drawn to a square of hindering terrain that includes the target',
    keywords: [],
    abilities: [],
    enhancements: [
      `${S.TARGET}-${S.GRAY}-${S.INF}`,
      `${S.MOVE}-${S.RED}`,
      `${S.MOVE}-${S.GREEN}`,
      `${S.MOVE}-${S.BROWN}-${S.RING}`,
      `${S.MOVE}-${S.GRAY}-${S.INF}`
    ]
  },
  {
    term: S.IMMOBILE,
    text: 'This character or object can\'t be moved or placed.  If this is an object, it can\'t be picked up or held.',
    keywords: [],
    abilities: [],
    enhancements: []
  },
  {
    term: S.KNOCKBACK,
    text: 'When one or more opposing characters takes damage from this character\'s attack, you may choose to knock back all hit characters as amount equal to their damage clicked.',
    keywords: [],
    abilities: [],
    enhancements: []
  },
  {
    term: S.PROTECTED,
    text: 'This character can\'t be targeted or damaged by {}.  If this character was targeted by the effect, the effect\'s duration immediately expires.  If the specified effect is Outwit or Pulse Wave, their "cant\'t be used" doesn\'t apply to this keyphrase.',
    keywords: [],
    abilities: [],
    enhancements: []
  },
  {
    term: S.RAM,
    text: 'Move in a direct path.  After resolutions, make a close attack targeting all opposing characters moved through, regardless of adjaceny.  Hit characters are dealt this character\'s printed damage value instead of normal damage.  Deal this character 1 unavoidable damage for each hit character.',
    keywords: [],
    abilities: [],
    enhancements: [`${S.MOVE}-${S.GRAY}-${S.DOT}`]
  },
  {
    term: S.SIDELINE_ACTIVE,
    text: '{} can be used while this character is on the sideline',
    keywords: [],
    abilities: [],
    enhancements: []
  },
  {
    term: S.STOP,
    text: 'When this click is revealed due to damage taken from an opponents attack, stop turning the dial.  When this character would be healed by Regeneration or Support, it\'s healed 1 less click',
    keywords: [
      {keyword: S.PROTECTED, value: S.OUTWIT},
      {keyword: S.PROTECTED, value: S.PULSE_WAVE}
    ],
    abilities: [],
    enhancements: []
  },
  {
    term: S.SWIM,
    text: 'Modify defense +1 against ranged attacks if this character occupies Water terrain',
    keywords: [],
    abilities: [],
    enhancements: [`${S.MOVE}-${S.LIGHT_BLUE}`]
  },
  {
    term: S.TINY,
    text: 'Modify defense +1 against ranged attacks',
    keywords: [],
    abilities: [],
    enhancements: []
  },
  {
    term: S.BREAKAWAY,
    text: 'Increase or decrease the action total of the specified characters rolls to break away by {}',
    keywords: [],
    abilities: [],
    enhancements: []
  }
];

const abilities = [
  {
    category: S.SPEED,
    action: S.FLURRY,
    color: S.RED,
    text: 'CLOSE: make up to two close attacks.',
    enhancements: []
  },
  {
    category: S.SPEED,
    action: S.LEAP,
    color: S.ORANGE,
    text: 'Elevation does not effect adjacency when choosing targets for a close attack. Move (Up to your speed value)',
    enhancements: [
      `${S.MOVE}-${S.RED}`,
      `${S.MOVE}-${S.GREEN}`,
      `${S.MOVE}-${S.BROWN}-${S.RING}`,
      `${S.MOVE}-${S.GRAY}-${S.INF}`
    ],
    keywords: [
      {keyword: S.BREAKAWAY, value: 2}
    ]
  },
  {
    category: S.SPEED,
    action: S.PHASING,
    color: S.YELLOW,
    text: 'Move up to your speed value',
    enhancements: [
      `${S.MOVE}-${S.RED}`,
      `${S.MOVE}-${S.GREEN}`,
      `${S.MOVE}-${S.BROWN}`,
      `${S.MOVE}-${S.GRAY}-${S.DOT}`
    ],
    keywords: []
  },
  {
    category: S.SPEED,
    action: S.EARTHBOUND,
    color: S.LIGHT_GREEN,
    text: `Cannot use any enhancements or ${S.WILLPOWER}`,
    enhancements: [],
    keywords: []
  },
  {
    category: S.SPEED,
    action: S.CHARGE,
    color: S.GREEN,
    text: 'Can\'t be knocked back.  POWER: Halve speed, move, then CLOSE attack at no additional cost.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.SPEED,
    action: S.MIND_CONTROL,
    color: S.LIGHT_BLUE,
    text: 'CLOSE/RANGE: Maximum range value 4.  Make a close/range attack.  Instead of normal damage, a hit character halves speed and becomes friendly to your force and may in either order: Move and/or make an attack.  Then it reverts forces.',
    enhancements: [],
    keywords: []
  },
  {
    action: S.PLASTICITY,
    category: S.SPEED,
    color: S.BLUE,
    text: 'Adjacent opposing characters get BREAKAWAY -2.  Adjacent opposing characters of the same size or smaller can\'t use enhancements or automatically break away.',
    keywords: [
      {keyword: S.BREAKAWAY, value: 2}
    ],
    enhancements: []
  },
  {
    category: S.SPEED,
    action: S.FORCE_BLAST,
    color: S.PURPLE,
    text: 'POWER: Roll a d6.  A target adjacent opposing character is knocked back equal to the result.',
    keywords: [
      {keyword: S.KNOCKBACK, value: 'd6'}
    ]
  },
  {
    category: S.SPEED,
    action: S.SIDESTEP,
    color: S.PINK,
    text: 'FREE: Move up to 2 squares.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.SPEED,
    action: S.HYPERSONIC_SPEED,
    color: S.BROWN,
    text: 'POWER: Halve range and enhancements.  Move, then make an attack, then move up to your speed value minus the number of squares just moved.',
    keywords: [
      {keyword: S.BREAKAWAY, value: 2},
      {keyword: S.PASSENGER, value: 0}
    ],
    enhancements: []
  },
  {
    category: S.SPEED,
    action: S.STEALTH,
    color: S.BLACK,
    text: 'When it\'s not your turn, hindered lines of fire drawn to this character are blocked.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.SPEED,
    action: S.RUNNING_SHOT,
    color: S.GRAY,
    text: 'POWER: Halve speed.  Move, then RANGE attack at no additional cost.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.ATTACK,
    action: S.BLADES,
    color: S.RED,
    text: 'When this character hits and would deal normal damage during a CLOSE attack, you may roll a d6.  If you do, deal damage equal to the result instead of normal damage.  Minimum result is the character\'s printed damage value -1.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.ATTACK,
    action: S.ENERGY_EXPLOSION,
    color: S.ORANGE,
    text: 'RANGE: Make a range attack, and all other characters adjacent to an original target also become targets.  Hit characters are dealt 2 damage instead of normal damage.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.ATTACK,
    action: S.PULSE_WAVE,
    color: S.YELLOW,
    text: 'RANGE: Halve range.  Other characters within range can\'t use powers or abilities (for this action).  Make a ranged attack targeting all characters, at least one of which must be opposing, within range and line of fire using their printed defense values.  If more than one character is targeted, each hit character is dealt 1 damage insteado f normal damage.',
    enhancements: [
      `${S.TARGET}-${S.GRAY}-${S.DOT}`,
      `${S.TARGET}-${S.GRAY}-${S.INF}`
    ],
    keywords: []
  },
  {
    category: S.ATTACK,
    action: S.QUAKE,
    color: S.LIGHT_GREEN,
    text: 'CLOSE: Make a close attack targeting all adjacent opposing characters.  If more than one character is targeted, each hit character is dealt 2 damage instead of normal damage.',
    keywords: [
      {keyword: S.KNOCKBACK}
    ],
    enhancements: []
  },
  {
    category: S.ATTACK,
    action: S.SUPER_STRENGTH,
    color: S.GREEN,
    text: 'This character can pick up (and hold) heavy objects.',
    keywords: [
      {keyword: S.KNOCKBACK}
    ],
    enhancements: []
  },
  {
    category: S.ATTACK,
    action: S.INCAPACITATE,
    color: S.LIGHT_BLUE,
    text: 'CLOSE/RANGE: Make a close/range attack.  Hit targets are given an action token instead of normal damage.  After resolutions, if a hit target had 2 action tokens, deal them 1 penetrating damage.',
    keywords: [],
    enhancements: []
  },
  {
    category: S.ATTACK,
    action: S.PENETRATING,
    color: S.BLUE,
    text: 'RANGE: Make a range attack.  Damage dealt by this attack is penetrating.',
    keywords: [],
    enhancements: []
  },
  {
    category: S.ATTACK,
    action: S.SMOKE_CLOUD,
    color: S.PURPLE,
    text: 'POWER: Minimum range 4.  Place up to 6 hindering markers within range, each adjacent to at least one other, and at least one marker must be within line of fire.  Opposing characters occupying a marker modify attack -1.  At the beginning of your next turn (even if this is lost) remove them.',
    keywords: [],
    enhancements: []
  },
  {
    category: S.ATTACK,
    action: S.PRECISION_STRIKE,
    color: S.PINK,
    text: 'When this character attacks a single character, damage taken from the attack can\'t be reduced below 1 and the target decreases its d6 roll for Super Senses by -1.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.ATTACK,
    action: S.STEAL_ENERGY,
    color: S.BLACK,
    text: 'When this character hits with a close attack, after resolutions heal 1 click if one or more opposing characters were damaged by the attack.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.ATTACK,
    action: S.TELEKINESIS,
    color: S.GRAY,
    text: 'POWER: Minium range value 6.  Pick up an object (light or heavy) within range and line of fire, the give a RANGE object action at no cost or place it in a square within range and line of fire.  POWER: Mimimun range 6.  Place on target single-base character within range and line of fire into another square within range and line of fire.  That square must be within 6 squares and line of fire from the target\'s current square.  If the target is an opposing character, first make a range attack and the hit character is the placed instead of normal damage.  Characters placed by this power can\'t use Telekinesis this turn.',
    enhancements: [
      `${S.TARGET}-${S.GRAY}-${S.INF}`
    ],
    keywords: []
  },
  {
    category: S.DEFENSE,
    action: S.SUPER_SENSES,
    color: S.RED,
    text: 'When this character would be hit, you may roll a d6.  5 or 6 causes a miss.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DEFENSE,
    action: S.TOUGHNESS,
    color: S.ORANGE,
    text: 'Reduce damage by 1.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DEFENSE,
    action: S.DEFEND,
    color: S.YELLOW,
    text: 'Adjacent friendly characters may replace their defense vaule with this character\'s printed defense value.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DEFENSE,
    action: S.COMBAT_REFLEXES,
    color: S.LIGHT_GREEN,
    text: 'Can\'t be knocked back.  Modify defense +2 against close attacks.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DEFENSE,
    action: S.ENERGY_SHEILD,
    color: S.GREEN,
    text: 'Modify defense +2 against range attacks.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DEFENSE,
    action: S.BARRIER,
    color: S.LIGHT_BLUE,
    text: 'POWER: Minimum range value 4.  Place up to 4 Blocking markers in clear squares within range, each adjacent to at least one other, and at least one marker must be within line of fire.  At the beginning of your next turn (even if this is lost) remove them.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DEFENSE,
    action: S.MASTERMIND,
    color: S.BLUE,
    text: 'When this character would be hit by an opponent\'s attack that deals damage, you may choose an adjacent friendly character that wouldn\'t be hit by this attack and that is less points or shares a keyword.  that friendly character instead becomes a hit target of the attack, even it it\'s already a target (or would be an illegal target).',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DEFENSE,
    action: S.WILLPOWER,
    color: S.PURPLE,
    text: 'When this character is dealt pushing damage, you may choose to redues the damage taken to 0.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DEFENSE,
    action: S.INVINCIBLE,
    color: S.PINK,
    text: 'Reduce damage taken by 2.  Can reduce penetrating damage.  Takes a maximum of 3 damage (at once).',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DEFENSE,
    action: S.IMPERVIOUS,
    color: S.BROWN,
    text: 'Reduce damage taken by 2.  When this character would take damage from an attack, you may roll a d6.  5 or 6 reduces damage taken to 0.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DEFENSE,
    action: S.REGENERATION,
    color: S.BLACK,
    text: 'POWER: Roll a d6.  Heal a number of clicks equal to half the result (rounded up).',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DEFENSE,
    action: S.INVULNERABILITY,
    color: S.GRAY,
    text: 'Reduce damage taken by 2.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DAMAGE,
    action: S.RANGED_COMBAT_EXPERT,
    color: S.RED,
    text: 'POWER: Choose one.  Modify attack +2, damage +2, or both +1.  Make a ranged attack targetting a single character.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DAMAGE,
    action: S.BATTLE_FURY,
    color: S.ORANGE,
    text: 'This character can\'t make range attacks, can\'t be carried.  When this character attacks, opposing characters can\'t use Shape Change',
    enhancements: [],
    keywords: [
      {keyword: S.PROTECTED, value: S.INCAPACITATE}
    ],
    abilities: [
      {category: S.SPEED, action: S.MIND_CONTROL}
    ]
  },
  {
    category: S.DAMAGE,
    action: S.SUPPORT,
    color: S.YELLOW,
    text: 'POWER: Choose a target adjacent friendly character.  If this character and the target aren\'t adjacent to any opposing characters, roll 2d6.  Add the result to this character\'s attack value, and if that is equal to or higher than the target\'s defense value, roll a d6.  The target is healed of that result -2, minimum 2.  (This is not an attack).',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DAMAGE,
    action: S.EXPLOIT_WEAKNESS,
    color: S.LIGHT_GREAN,
    text: 'CLOSE: Make a close attack.  Damage dealt by this attack is penetrating.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DAMAGE,
    action: S.ENHANCEMENT,
    color: S.GREEN,
    text: 'Adjacent friendly characters modify damage +1 while making a range attack.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DAMAGE,
    action: S.PROBABILITY_CONTROL,
    color: S.LIGHT_BLUE,
    text: 'Once per turn, you may reroll a target character\'s attack roll or break away roll.  A targeted character must be within range and line of fire, minimum range value 6.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DAMAGE,
    action: S.SHAPE_CHANGE,
    color: S.BLUE,
    text: 'When this character would be targeted by an attack, you may roll d6.  5 or 6, this character can\'t be targeted by the attack this turn and the attacker may choose a different target.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DAMAGE,
    action: S.CLOSE_COMBAT_EXPERT,
    color: S.PURPLE,
    text: 'POWER: Choose one.  Modify an attack +2, damage +2 or both +1.  Make a close attack.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DAMAGE,
    action: S.EMPOWER,
    color: S.PINK,
    text: 'Adjacent friendly characters modify damage +1 while making a close attack.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DAMAGE,
    action: S.PERPLEX,
    color: S.BROWN,
    text: 'FREE: Minium range value 6.  Choose a target character within range and line of fire.  Modify one of that character\'s combat values +1 or -1 until your next turn.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DAMAGE,
    action: S.OUTWIT,
    color: S.BLACK,
    text: 'Minium range value 6.  Choose a power (standard or special) and a target opposing character within range and line of fire.  The target can\'t use the chosen power until your next turn.',
    enhancements: [],
    keywords: []
  },
  {
    category: S.DAMAGE,
    action: S.LEADERSHIP,
    color: S.GRAY,
    text: 'At the beginning of your turn, for all characters that can use this power, Action Total +1.  At the beginning of your turn, you may roll a d6.  5 or 6 remove an action token from an adjacent friendly character that\'s less points or shares a keyword.',
    keywords: [],
    enhancements: []
  }
];

module.exports = {
  abilities,
  keywords,
  enhancements
};
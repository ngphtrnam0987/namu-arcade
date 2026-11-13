export interface Achievement {
  id: string;
  title: string;
  description: string;
  gameId?: 'gravity-flip' | 'laser-lab' | 'global';
  icon: string;
  badgeColor: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first-play',
    title: 'First Play',
    description: 'Launch and play any game on NAMU ARCADE for the first time.',
    gameId: 'global',
    icon: 'Gamepad2',
    badgeColor: '#00F0FF',
    rarity: 'Common',
  },
  {
    id: 'gravity-rookie',
    title: 'Gravity Rookie',
    description: 'Complete Level 1 in Gravity Flip Classic Mode.',
    gameId: 'gravity-flip',
    icon: 'ChevronsUp',
    badgeColor: '#38BDF8',
    rarity: 'Common',
  },
  {
    id: 'gravity-master',
    title: 'Gravity Master',
    description: 'Conquer all 3 Classic Mode levels in Gravity Flip.',
    gameId: 'gravity-flip',
    icon: 'Crown',
    badgeColor: '#F59E0B',
    rarity: 'Legendary',
  },
  {
    id: 'survivor',
    title: 'Survivor',
    description: 'Reach a score of 50 or higher in Gravity Flip Endless Mode.',
    gameId: 'gravity-flip',
    icon: 'Flame',
    badgeColor: '#EC4899',
    rarity: 'Epic',
  },
  {
    id: 'puzzle-starter',
    title: 'Puzzle Starter',
    description: 'Direct your first beam to the target and solve Level 1 of Laser Lab.',
    gameId: 'laser-lab',
    icon: 'Lightbulb',
    badgeColor: '#10B981',
    rarity: 'Common',
  },
  {
    id: 'laser-expert',
    title: 'Laser Expert',
    description: 'Solve all 15 optical puzzles across Beginner, Intermediate, and Advanced tiers in Laser Lab.',
    gameId: 'laser-lab',
    icon: 'Zap',
    badgeColor: '#A855F7',
    rarity: 'Legendary',
  },
  {
    id: 'refraction-star',
    title: 'Refraction Star',
    description: 'Achieve a flawless 3-star rating on any Laser Lab level.',
    gameId: 'laser-lab',
    icon: 'Star',
    badgeColor: '#FBBF24',
    rarity: 'Rare',
  },
  {
    id: 'neon-marathon',
    title: 'Neon Marathon',
    description: 'Play 10 total game runs across the NAMU ARCADE platform.',
    gameId: 'global',
    icon: 'Sparkles',
    badgeColor: '#6366F1',
    rarity: 'Rare',
  },
];

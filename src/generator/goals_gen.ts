import { Game } from '../game_data/game';
import { Goal } from '../game_data/goal';
import { RelationshipStrength } from '../game_data/relationship';
import { getRandomOfSeed } from '../random';

export function assignGoalsFromPlotsToPlayersInGame(game: Game): void {
  for (const plot of game.plots) {
    for (const player of plot.players) {
      const goal = new Goal(`Resolve plot ${plot.name}`, plot.plotSummary, plot);
      player.goals.push(goal);
    }
  }
}

export function assignBonusGoalsFromOtherPeopleInGame(game: Game): void {
  const random = getRandomOfSeed(game.seed);
  for (const player of game.players) {
    if (random.spiced('bonus_goal', player.title).chanceRoll(0.25)) {
      continue;
    }
    const strongFriends = player.relationships.filter((rel) => rel.strength === RelationshipStrength.STRONG);
    const bestFriend = random.spiced('best_friend', player.title).sampleOne(strongFriends);
    const goal = new Goal(
      'Lean into this relationship',
      `You feel very ${bestFriend.alignment} about ${bestFriend.theFriendThatsNotMe(player).title}. Do something about it`,
    );
    player.goals.push(goal);
  }
}

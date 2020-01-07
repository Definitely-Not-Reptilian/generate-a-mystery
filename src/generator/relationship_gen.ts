import { Game } from '../game_data/game';
import { getRandomOfSeed, Random } from '../random';
import { Player } from '../game_data/player';
import { RelationshipStrength, Relationship, RelationshipAlignment } from '../game_data/relationship';

export function assignRelationshipsToPlayersInGame(strongFriends: number, weakFriends: number, game: Game): void {
  const random = getRandomOfSeed(game.seed);
  for (const player of game.players) {
    const potentialFriends = [ ...game.players ];
    potentialFriends.splice(potentialFriends.indexOf(player), 1);
    let existingStrongFriends = 0;
    let existingWeakFriends = 0;
    for (const friend of player.relationships) {
      if (potentialFriends.indexOf(friend.theFriendThatsNotMe(player)) !== -1) {
        potentialFriends.splice(potentialFriends.indexOf(friend.theFriendThatsNotMe(player)), 1);
      }
      if (friend.strength === RelationshipStrength.STRONG) {
        existingStrongFriends++;
      }
      if (friend.strength === RelationshipStrength.WEAK) {
        existingWeakFriends++;
      }
    }
    for (let i = 0; i < strongFriends - existingStrongFriends; i++) {
      game.relationships.push(makeNewFriend(player, potentialFriends, RelationshipStrength.STRONG, random));
    }
    for (let i = 0; i < weakFriends - existingWeakFriends; i++) {
      game.relationships.push(makeNewFriend(player, potentialFriends, RelationshipStrength.WEAK, random));
    }
  }
}
function makeNewFriend(player: Player, potentialFriends: Player[], strength: RelationshipStrength, random: Random): Relationship {
  const newFriend = random.pickRandomAndRemove(potentialFriends);
  const newRelationship = new Relationship();
  newRelationship.player1 = player;
  newRelationship.player2 = newFriend;
  newRelationship.strength = strength;
  newRelationship.alignment = random.randomRoll() > 0.5 ? RelationshipAlignment.POSITIVE : RelationshipAlignment.NEGATIVE;
  player.relationships.push(newRelationship);
  newFriend.relationships.push(newRelationship);
  return newRelationship;
}

import { Game } from '../game_data/game';
import { getRandomOfSeed } from '../random';
import { Player } from '../game_data/player';
import { RelationshipStrength, Relationship, RelationshipAlignment } from '../game_data/relationship';

export function assignRelationshipsToPlayersInGame(strongFriendsRange: [number, number], weakFriendsRange: [number, number], game: Game): void {
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
    const weightedPotentialFriends: {friend: Player, weight: number}[] = potentialFriends.map((friend) => ({ friend, weight: 10 }));
    for (const goal of player.goals) {
      for (const plotBuddy of goal.plot.players) {
        const weightedFriend = weightedPotentialFriends.find((f) => f.friend === plotBuddy);
        if (weightedFriend) {
          weightedFriend.weight = weightedFriend.weight * 2;
        }
      }
    }
    const minimumStrongFriends = random.getRandomBetween(...strongFriendsRange);
    const minimumWeakFriends = random.getRandomBetween(...weakFriendsRange);
    const newStrongFriendsNeeded = Math.max(0, minimumStrongFriends - existingStrongFriends);
    const newWeakFriendsNeeded = Math.max(0, minimumWeakFriends - existingWeakFriends);
    const totalNewFriendsNeeded = newStrongFriendsNeeded + newWeakFriendsNeeded;
    const newFriendsList = random.pickNFromWeightedListWithoutReplacement(totalNewFriendsNeeded, weightedPotentialFriends);
    for (let i = 0; i < newFriendsList.length; i++) {
      const newFriend = newFriendsList[i].friend;
      const strength = i < newStrongFriendsNeeded ? RelationshipStrength.STRONG : RelationshipStrength.WEAK;
      const alignment = random.randomRoll() > 0.5 ? RelationshipAlignment.POSITIVE : RelationshipAlignment.NEGATIVE;
      const newRelationship = new Relationship(player, newFriend, strength, alignment);
      player.relationships.push(newRelationship);
      newFriend.relationships.push(newRelationship);
    }
  }
}

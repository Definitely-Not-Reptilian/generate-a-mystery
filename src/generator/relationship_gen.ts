import { Game } from '../game_data/game';
import { getRandomOfSeed } from '../random';
import { Player } from '../game_data/player';
import { RelationshipStrength, Relationship, RelationshipAlignment } from '../game_data/relationship';

export function assignRelationshipsToPlayersInGame(strongFriendsRange: [number, number], weakFriendsRange: [number, number], game: Game): void {
  const random = getRandomOfSeed(game.seed);
  for (const player of game.players) {
    const potentialFriends = game.players.filter((otherPlayer) => !otherPlayer.optional);
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
    const minimumStrongFriends = random.spiced('minimum_strong_friends', player.title).getRandomBetween(...strongFriendsRange);
    const minimumWeakFriends = random.spiced('minimum_weak_friends', player.title).getRandomBetween(...weakFriendsRange);
    const newStrongFriendsNeeded = Math.max(0, minimumStrongFriends - existingStrongFriends);
    const newWeakFriendsNeeded = Math.max(0, minimumWeakFriends - existingWeakFriends);
    const totalNewFriendsNeeded = newStrongFriendsNeeded + newWeakFriendsNeeded;
    const newFriendsList = random.spiced('pick_new_friends', player.title).pickNFromWeightedListWithoutReplacement(totalNewFriendsNeeded, weightedPotentialFriends);
    for (let i = 0; i < newFriendsList.length; i++) {
      const newFriend = newFriendsList[i].friend;
      const strength = i < newStrongFriendsNeeded && !player.optional ? RelationshipStrength.STRONG : RelationshipStrength.WEAK;
      const alignment = random.spiced('maybe_hate_this_person', player.title, newFriend.title).chanceRoll(0.5) ? RelationshipAlignment.POSITIVE : RelationshipAlignment.NEGATIVE;
      const newRelationship = new Relationship(player, newFriend, strength, alignment);
      player.relationships.push(newRelationship);
      newFriend.relationships.push(newRelationship);
    }
  }
}

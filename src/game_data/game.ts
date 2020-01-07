import { Player } from './player';
import { Plot } from './plot';
import { Relationship } from './relationship';
import { Type } from 'class-transformer';

export class Game {
  name: string;
  @Type(() => Player)
  players: Player[] = [];
  @Type(() => Plot)
  plots: Plot[] = [];
  seed: string;

  constructor(name: string) {
    this.name = name;
  }

  private getPlayer(title: string) {
    return this.players.find((player) => player.title === title);
  }
  rehydrate() {
    for (const plot of this.plots) {
      // plot.players = [];
      plot.numberOfPlayers = plot.playerTitles.length;
      for (const playerTitle of plot.playerTitles) {
        plot.players.push(this.getPlayer(playerTitle));
      }
    }
    // this.players.forEach((p) => p.relationships = []); // class transformers seems to never run the constructor, so this needs to be inited
    const allRelationships: Set<string> = new Set();
    for (const player of this.players) {
      for (const otherPerson of player.otherPeople) {
        const otherPlayer = this.getPlayer(otherPerson.playerTitle);
        const relationship = new Relationship(player, otherPlayer, otherPerson.strength, otherPerson.alignment);
        if (!allRelationships.has(relationship.uniqueString)) {
          const otherPeopleDetailsAboutMe = otherPlayer.otherPeople.find((p) => p.playerTitle === player.title);
          if (otherPeopleDetailsAboutMe == null || otherPeopleDetailsAboutMe.alignment !== relationship.alignment || otherPeopleDetailsAboutMe.strength !== relationship.strength) {
            console.warn(`The relationship from ${player.title} to ${otherPlayer.title} does not seem to match. this could screw some stuff up`);
          }
          allRelationships.add(relationship.uniqueString);
          player.relationships.push(relationship);
          otherPlayer.relationships.push(relationship);
        }
      }
    }
  }
}

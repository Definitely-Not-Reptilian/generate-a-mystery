import { Game } from '../game_data/game';
import { Goal } from '../game_data/goal';

export function assignGoalsFromPlotsToPlayersInGame(game: Game): void {
  for (const plot of game.plots) {
    for (const player of plot.players) {
      const goal = new Goal();
      goal.name = `Resolve plot ${plot.name}`;
      goal.description = plot.plotSummary;
      goal.plot = plot;
      player.goals.push(goal);
    }
  }
}

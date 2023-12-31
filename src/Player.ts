import {PlayerObject} from './types/deck.types';

/**
 * @class Player Class - handles the creating of the players
 **/
export class Player {
  init(id: number): PlayerObject {
    const newPlayer: PlayerObject = {
      hand: [],
      player: id,
    };
    return newPlayer;
  }

  /**
   * Initialize the players
   * creating an array of playerInterface for each player
   *
   * @param playersCount number How many players to distribute cards between
   * @param players array Empty array of playerInterface type - that the function
   * will populate and return.
   *
   * @return array Array of the PlayerInterface object arr.length === playersCount
   */
  public initPlayers(
    playersCount: number,
    players: PlayerObject[],
  ): PlayerObject[] {
    let playerToPush: PlayerObject;
    for (let x = 0; x < playersCount; x++) {
      playerToPush = this.init(x);
      players.push(playerToPush);
    }
    return players;
  }
}

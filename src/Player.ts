import {PlayerInterface} from './types/deck.types';

export class Player {
  init(id: number): PlayerInterface {
    const newPlayer: PlayerInterface = {
      hand: [],
      player: id,
    };
    return newPlayer;
  }
}

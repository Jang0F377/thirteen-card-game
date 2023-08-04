import {PlayerInterface} from './types/deck.types';

export class Player {
  async init(id: number): Promise<PlayerInterface> {
    const newPlayer: PlayerInterface = {
      hand: [],
      player: id,
    };
    return newPlayer;
  }
}

import prompts from 'prompts';
import {CardInterface, PlayerInterface} from './types/deck.types';
import {chalkLog} from './utils/log-utils';

export class Game {
  private turnOrder: number[];
  private gameInProgress: boolean;
  private whoGoesFirst: number;
  constructor(private players: PlayerInterface[]) {}

  public init() {
    setTimeout(() => {
      const whoStarts = this._whoGoesFirst();
      this._setTurnOrder(whoStarts);
      this._orderHand(this.players);
      this.gameInProgress = true;
      this.beginGameFlow();
    }, 7000);
  }

  private takeTurn(player: number) {
    console.log(`It is now player ${player + 1}\'s turn `);
    const hand = this._showPlayersHand(player)?.map(x => {
      const title = `${x.value} of ${x.suitString}`;
      return {
        title,
        value: title,
      };
    });
    const prompt = prompts({
      type: 'multiselect',
      name: `player-${player + 1}-turn`,
      instructions: 'Chose what cards to play..',
      choices: hand,
      message: 'Your turn',
    });
    const response = prompt;
    response;
    this.gameInProgress = false;
  }

  public beginGameFlow() {
    let currentPlayer: number = this.whoGoesFirst;
    while (this.gameInProgress) {
      this.takeTurn(currentPlayer);
    }
  }

  private _showPlayersHand(current: number) {
    const player = this.players.find(p => p.player === current);
    return player?.hand;
  }

  private _whoGoesFirst(): number {
    let player = this.players.find(player => {
      let thisOne = player.hand.find(
        card => card.suit === 'D' && card.value === '2',
      );
      return thisOne;
    });
    this.whoGoesFirst = player?.player!;
    return player?.player!;
  }

  private _setTurnOrder(whoStarts: number): void {
    switch (whoStarts + 1) {
      case 1:
        this.turnOrder = [0, 1, 2, 3];
        break;
      case 2:
        this.turnOrder = [1, 2, 3, 0];
        break;
      case 3:
        this.turnOrder = [2, 3, 0, 1];
        break;
      case 4:
        this.turnOrder = [3, 0, 1, 2];
        break;
      default:
        chalkLog({color: 'red', message: 'ERROR SETTING TURN ORDER'});
        break;
    }
  }

  private _orderHand(players: PlayerInterface[]) {
    for (let x = 0; x < players.length; x++) {
      players[x].hand.sort();
    }
  }
}

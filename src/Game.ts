import prompts from 'prompts';
import {Player} from './Player';
import {CardInterface, DeckObject, PlayerInterface} from './types/deck.types';
import {chalkLog} from './utils/log.utils';
import chalk from 'chalk';

export class Game {
  private turnOrder: number[];
  private gameInProgress: boolean;
  private whoGoesFirst: number;
  private shuffledDeck: CardInterface[];
  private playersCount: number;
  private players: PlayerInterface[];
  private deckCount: number;
  private playedCardsPile: CardInterface[];
  private gameOver: boolean;
  constructor(private deck: DeckObject, private player: Player) {
    this.gameOver = false;
    this.shuffledDeck = this.deck.deck;
    this.deckCount = this.deck.config.deckCount!;
    this.playersCount = this.deck.config.playersCount!;
    this.players = [];
    this.playedCardsPile = [];
  }

  public start() {
    /* This is on setTimeout to offset for cli spinners in Deck.ts */
    setTimeout(() => {
      // Instantiate players
      this.player.initPlayers(this.playersCount, this.players);
      // Pass out the cards
      this._passOutCards(this.shuffledDeck, this.deckCount, this.playersCount);
      // Determine who was the 2 of D
      const whoStarts = this._whoGoesFirst();
      // Set turn order based on whoStarts
      this._setTurnOrder(whoStarts);
      // Sort players hands
      this._orderHand(this.players);
      // Set gameInProgress
      this.gameInProgress = true;
      // Begin game
      this.beginGameFlow();
    }, 5000);
  }

  private takeTurn(player: number) {
    console.log(chalk.green(`It is now player ${player + 1}\'s turn `));
    const hand = this._showPlayersHand(player);
    const prompt = prompts({
      type: 'multiselect',
      name: `player-${player + 1}-turn`,
      instructions: 'Chose what cards to play..',
      choices: hand,
      message: 'Your turn',
    });
    return prompt;
  }

  public beginGameFlow() {
    let currentPlayer: number = this.whoGoesFirst;
    while (this.gameInProgress) {
      currentPlayer = this.turnOrder[0];
      if (currentPlayer === this.turnOrder[0]) {
        this.takeTurn(currentPlayer);
        this.turnOrder.push(this.turnOrder.shift()!);
        continue;
      }

      if (this.gameOver) {
        // TODO
        break;
      }
    }
  }

  /***
   *
   * Sorts the players hand based on suit then strength
   *
   * @param players The PlayerInterface array of players
   */
  private _orderHand(players: PlayerInterface[]): void {
    for (let x = 0; x < players.length; x++) {
      players[x].hand.sort();
    }
  }

  /**
   *
   * Helper method to turn the cards in hand to prompts.Choice objects array
   *
   * @param current number The player who is currently taking a turn
   * @returns array prompts.Choice object - prompts requires
   * a title and value so we return it that way.
   */
  private _showPlayersHand(current: number): prompts.Choice[] | undefined {
    const player = this.players.find(p => p.player === current);
    return player?.hand.map(x => {
      return {
        title: x.fullName,
        value: x.fullName,
      };
    });
  }

  /**
   * Determines who has the 2 of Diamonds
   * to begin the game.
   *
   * @returns number Index of the player with 2 of D
   */
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

  /**
   * Sets the turn order based on who
   * had the 2 of Diamonds
   */
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

  private _passOutCards(
    shuffledDeck: CardInterface[],
    deckCount: number = 1,
    playersCount: number,
  ): void {
    let cardCount = deckCount * 52;
    const cardsPerPlayer = cardCount / playersCount;
    for (let x = 0; x <= cardsPerPlayer - 1; x++) {
      this.players.forEach(function (player, _idx, _arr) {
        player.hand.push(shuffledDeck.shift()!);
      });
    }
  }
}

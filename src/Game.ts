import chalk from 'chalk';
import prompts from 'prompts';
import {Player} from './Player';
import {
  CardObject,
  DeckObject,
  DiscardedCardObject,
  PlayerObject,
} from './types/deck.types';
import {chalkLog} from './utils/log.utils';

/**
 * @class Game handles the creation/start of the game.
 * Also responsible for instantiating the players and
 * passing out the cards to each player.
 */
export class Game {
  private turnOrder: number[];
  private gameInProgress: boolean;
  private whoGoesFirst: number;
  private shuffledDeck: CardObject[];
  private playersCount: number;
  private players: PlayerObject[];
  private deckCount: number;
  private playedCardsPile: DiscardedCardObject[];
  private gameOver: boolean;
  private whoHasPower: number | null = null;
  private turnNumber: number;
  constructor(private deck: DeckObject, private player: Player) {
    this.gameOver = false;
    this.shuffledDeck = this.deck.deck;
    this.deckCount = this.deck.config.deckCount!;
    this.playersCount = this.deck.config.playersCount!;
    this.players = [];
    this.playedCardsPile = [];
    this.turnNumber = 1;
  }

  /**
   * Method that starts the game.
   *
   * Instantiates the players,
   * passes out the cards,
   * and begins the game.
   */
  public start(): void {
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
    }, 4750);
  }

  private async takeTurn(player: number) {
    console.log(
      chalk.green(
        `It is now player ${player + 1}\'s turn -- Turn-${this.turnNumber}`,
      ),
    );
    const hand = this._convertHandToPrompts(player);
    // Add the option to pass
    hand?.push({
      title: 'Pass',
      value: null,
    });
    // Create prompt with your hand
    const prompt = prompts({
      type: 'multiselect',
      name: `player-${player + 1}-turn`,
      instructions: 'Chose what cards to play..',
      choices: hand,
      message: 'Your turn',
    });
    return prompt;
  }

  public async beginGameFlow() {
    let currentPlayer: number = this.whoGoesFirst;
    while (this.gameInProgress) {
      currentPlayer = this.turnOrder[0];
      if (currentPlayer === this.turnOrder[0]) {
        await this.takeTurn(currentPlayer);
        this.turnOrder.push(this.turnOrder.shift()!);
        if (this.gameOver) {
          // TODO
          break;
        }

        this.turnNumber++;
      }
    }
  }

  /***
   *
   * Sorts the players hand based on suit then strength
   *
   * @param players The PlayerInterface array of players
   */
  private _orderHand(players: PlayerObject[]): void {
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
  private _convertHandToPrompts(current: number): prompts.Choice[] | undefined {
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
        card => card.suit === 'D' && card.rank === '2',
      );
      return thisOne;
    });
    this.whoGoesFirst = player?.player!;
    return player?.player!;
  }

  /**
   * Helper func used to set the turn order.
   *
   * To start the game the turn order is
   * determined by who has the 2 of diamonds.
   *
   * The turn order has the potential to change
   * after every one has a turn depending on
   * who won control.
   *
   * @param whoStarts number Index of player to start the turn
   *
   * @returns void
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

  /**
   *
   * Helper func that takes the shuffled deck and
   * passes out the cards among each player.
   *
   * @param shuffledDeck Array of shuffled CardObjects
   * @param deckCount Number of decks used. Default: 1
   * @param playersCount Number of players in current game
   *
   * @returns void
   */
  private _passOutCards(
    shuffledDeck: CardObject[],
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

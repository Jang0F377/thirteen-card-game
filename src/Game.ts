import chalk from 'chalk';
import prompts from 'prompts';
import {Player} from './Player';
import {
  CardObject,
  DeckObject,
  DiscardedCardObject,
  GameState,
  PlayerObject,
  PossibleCombinations,
} from './types/deck.types';
import {chalkLog} from './utils/log.utils';

/**
 * @class Game handles the creation/start of the game.
 * Also responsible for instantiating the players and
 * passing out the cards to each player.
 */
export class Game {
  private whoGoesFirst: number;
  private shuffledDeck: CardObject[];
  private playersCount: number;
  private deckCount: number;
  private gameOver: boolean;
  private possibleCombinations: PossibleCombinations[];
  gameState: GameState;
  constructor(private deck: DeckObject, private player: Player) {
    this.gameOver = false;
    this.shuffledDeck = this.deck.deck;
    this.deckCount = this.deck.config.deckCount!;
    this.playersCount = this.deck.config.playersCount!;
    this.gameState = {
      currentTurnState: {
        howManyCards: 0,
        firstCard: null,
        lastCard: null,
        playType: null,
        lastCardComparableValue: null,
      },
      inProgress: false,
      placementOutcome: [],
      turnNumber: 0,
      playersState: [],
      currentTurnOrder: [],
      whoHasPower: undefined,
      playedCardsPile: [],
    };
  }

  /**
   *
   * Method that starts the game.
   *
   * Instantiates the players,
   * passes out the cards,
   * and begins the game.
   */
  public start(): void {
    /* This is on setTimeout to offset for cli spinners in Deck.ts */
    setTimeout(async () => {
      // Instantiate players
      this.player.initPlayers(this.playersCount, this.gameState.playersState);
      // Pass out the cards
      this._passOutCards(this.shuffledDeck, this.deckCount, this.playersCount);
      // Determine who was the 2 of D
      const whoStarts = this._whoGoesFirst();
      // Set turn order based on whoStarts
      this._setTurnOrder(whoStarts);
      // Sort players hands
      await this._orderHand(this.gameState.playersState);
      // Set gameInProgress
      this.gameState.inProgress = true;
      // Set turnNumber to 1 as game starts
      this.gameState.turnNumber = 1;
      // Begin game
      await this.beginGameFlow();
    }, 4750);
  }

  private async takeTurn(player: number) {
    console.log(
      chalk.green(
        `It is now player ${player + 1}\'s turn -- Turn-${
          this.gameState.turnNumber
        }`,
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

  /**
   * @method beginGameFlow()
   * @description is called at the end of the start() method.
   * Handles the game loop
   */
  public async beginGameFlow(): Promise<void> {
    let currentPlayer: number = this.whoGoesFirst;
    while (this.gameState.inProgress) {
      currentPlayer = this.gameState.currentTurnOrder[0];
      if (currentPlayer === this.gameState.currentTurnOrder[0]) {
        // Get the prompt choices from the cli
        const res = await this.takeTurn(currentPlayer);

        // Handle validating choices and setting global state
        this._validation(
          res[`player-${currentPlayer + 1}-turn`],
          currentPlayer,
        );

        // Push the person who just went to the end of the array
        this.gameState.currentTurnOrder.push(
          this.gameState.currentTurnOrder.shift()!,
        );

        // DEBUGGING
        if (this.gameState.turnNumber === 2) {
          // TODO
          this.gameState.inProgress = false;
        }

        // Increment turn number
        this.gameState.turnNumber++;
      }
    }
  }

  /**
   *
   * Sorts the players hand based on suit then strength
   *
   * @param players The PlayerInterface array of players
   */
  private async _orderHand(players: PlayerObject[]): Promise<void> {
    for (let x = 0; x < players.length; x++) {
      players[x].hand.sort((a, b) => {
        return a.comparableValue[0] - b.comparableValue[0];
      });
      players[x].hand.sort((a, b) => {
        return a.comparableValue[1] - b.comparableValue[1];
      });
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
    const player = this.gameState.playersState.find(p => p.player === current);
    return player?.hand.map((x, idx) => {
      return {
        title: x.fullName,
        value: idx,
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
    const player = this.gameState.playersState.find(p => {
      const thisOne = p.hand.find(
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
        this.gameState.currentTurnOrder = [0, 1, 2, 3];
        break;
      case 2:
        this.gameState.currentTurnOrder = [1, 2, 3, 0];
        break;
      case 3:
        this.gameState.currentTurnOrder = [2, 3, 0, 1];
        break;
      case 4:
        this.gameState.currentTurnOrder = [3, 0, 1, 2];
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
    deckCount = 1,
    playersCount: number,
  ): void {
    const cardCount = deckCount * 52;
    const cardsPerPlayer = cardCount / playersCount;
    for (let x = 0; x <= cardsPerPlayer - 1; x++) {
      this.gameState.playersState.forEach(function (player, _idx, _arr) {
        player.hand.push(shuffledDeck.shift()!);
      });
    }
  }

  private _determinePossibleCombinations() {}

  private _determineCardPlayType(played: DiscardedCardObject[], len: number) {
    // Set the gameState variable
    this.gameState.currentTurnState.howManyCards = len;

    // Determine the gameState playType
    if (len === 1) {
      this.gameState.currentTurnState.playType = 'Single card, rank wins';
      return;
    }
    if (len === 2) {
      this.gameState.currentTurnState.playType = 'Pair, rank wins';
      return;
    }
    if (len === 3) {
      if (
        played[0].fullName === played[1].fullName &&
        played[0].fullName === played[2].fullName
      ) {
        this.gameState.currentTurnState.playType = '3 of a kind, rank wins';
        return;
      } else {
        this.gameState.currentTurnState.playType =
          '3 card straight, highest last card rank/suit wins';
        return;
      }
    }
    if (len === 4) {
      if (
        played[0].fullName === played[1].fullName &&
        played[0].fullName === played[2].fullName &&
        played[0].fullName === played[3].fullName
      ) {
        this.gameState.currentTurnState.playType =
          '4 of a kind - cop killer - only higher rank 4 of a kind can win';
        return;
      } else {
        this.gameState.currentTurnState.playType =
          '4 card straight, highest last card rank/suit wins';
        return;
      }
    }
    if (len === 5) {
      this.gameState.currentTurnState.playType =
        '5 card straight, highest last card rank/suit wins';
      return;
    }
    if (len === 6) {
      if (
        played[0].rank === played[1].rank &&
        played[2].rank === played[3].rank &&
        played[4].rank === played[5].rank
      ) {
        this.gameState.currentTurnState.playType =
          '6 card cop killer - only beatable by a higher rank/suit 6 card cop killer OR a 4 of a kind cop killer.';
        return;
      }
    }
    if (len >= 7) {
      this.gameState.currentTurnState.playType = `${len} card straight, highest last card rank/suit wins`;
      return;
    }
  }

  private _validation(choices: number[], currentPlayer: number) {
    // Setup empty array for chosen cards
    const discardedCards: DiscardedCardObject[] = [];
    const len = choices.length - 1;
    // Get the players hand
    const hand = this.gameState.playersState[currentPlayer].hand;

    /**
     *
     * Here we loop through the choices array starting at the last item.
     * We do this so when we splice the hand to remove the played card,
     * the index for the proceeding cards is not throw off.
     *
     **/
    for (let x = len; x >= 0; x--) {
      const thisOne = choices[x];
      // Add properties for discarded cards and push to local discardedCards
      const discarded: DiscardedCardObject = {
        ...hand[thisOne],
        playedBy: currentPlayer,
        turnPlayed: this.gameState.turnNumber,
      };
      discardedCards.push(discarded);
      // Remove the played card from the players hand
      hand.splice(thisOne, 1);
    }
    // Sort the discardedCards & push to playedCardsPile array
    const sorted = this._sort(discardedCards);
    sorted.forEach(card => {
      this.gameState.playedCardsPile.push(card);
    });

    // Set the gameState.currentTurnState values
    this._determineCardPlayType(discardedCards, choices.length);
    this.gameState.currentTurnState.firstCard = sorted[0];
    this.gameState.currentTurnState.lastCard = sorted[len];
    this.gameState.currentTurnState.lastCardComparableValue =
      sorted[len].comparableValue;
    console.log('STATE', this.gameState);
  }

  private _validatePlayedCards(playedCards: DiscardedCardObject[]) {
    // Get current state we are going to need
    const howManyCards = this.gameState.currentTurnState.howManyCards;
    const lastCard = this.gameState.currentTurnState.lastCard;
    const lastCardComparableValue = lastCard?.comparableValue;
    const playedLength = playedCards.length;

    /**
     *
     * Steps for validating:
     * 1. Does it match current turn state ie: how many cards & play type
     * 2. Does it beat currentTurnState.lastCard.comparableValue
     * 3.
     */
  }

  /**
   *
   * helper function to sort arrays of CardObjects
   * @param values array of CardObject objects
   * @returns array of CardObjects sorted by rank then suit
   */
  private _sort(values: DiscardedCardObject[]) {
    return values.sort((a, b) => {
      if (a.comparableValue[0] === b.comparableValue[0]) {
        return a.comparableValue[1] - b.comparableValue[1];
      } else {
        return a.comparableValue[0] - b.comparableValue[0];
      }
    });
  }
}

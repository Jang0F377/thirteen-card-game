import {Ora} from 'ora';
import {Card} from './Card';
import {Player} from './Player';
import {cardSuits, cardValues} from './constants/cards.constants';
import {
  CardInterface,
  DeckCreationOptions,
  PlayerInterface,
} from './types/deck.types';
import {spinnerLog} from './utils/log-utils';

/**
 * @class Deck Object - handles the creating of the cards
 * as well as shuffling the deck and passing out
 * the cards
 **/
export class Deck {
  private timesShuffled: number;
  private useJokers: boolean;
  private jokerCount: number;
  private cardValues: Record<string, string>;
  private cardSuits: Record<string, string>;
  private deckCount: number;
  private deck: CardInterface[];
  private playersCount: number;
  private players: PlayerInterface[] = [];
  private player: Player;
  private card: Card;
  opts: any;

  constructor(options: DeckCreationOptions, player: Player, card: Card) {
    if (!options.useJokers) delete options.jokerCount;

    const defaults: DeckCreationOptions = {
      timesShuffled: 5,
      useJokers: false,
      jokerCount: 2,
      deckCount: 1,
      players: 4,
    };

    this.opts = Object.assign({}, defaults, options);
    this.timesShuffled = this.opts.timesShuffled!;
    this.useJokers = this.opts.useJokers!;
    this.jokerCount = this.opts.jokerCount!;
    this.deckCount = this.opts.deckCount!;
    this.cardValues = cardValues;
    this.cardSuits = cardSuits;
    this.playersCount = this.opts.players!;

    this.player = player;
    this.card = card;
  }

  /**
   * Initialize and shuffle a deck,
   * and pass out the cards.
   *
   * @return array The PlayerInterface object
   */
  init(): PlayerInterface[] {
    let initSpinner: Ora;
    initSpinner = spinnerLog({
      spinnerColor: 'blue',
      spinnerMessage: 'Initializing Deck!',
      spinnerType: 'binary',
    });
    initSpinner.start();
    // Create the deck
    this.deck = this.createDeck(this.card);
    setTimeout(() => {
      initSpinner.succeed('Deck Initialized.');
    }, 1250);

    // Shuffle the deck
    setTimeout(() => {
      initSpinner = spinnerLog({
        spinnerType: 'pong',
        spinnerColor: 'cyan',
        spinnerMessage: `Shuffling deck ${this.timesShuffled} times...`,
      }).start();
    }, 2500);
    this.shuffleDeck(this.timesShuffled, this.deck);

    setTimeout(() => {
      initSpinner.succeed("Done! Let's deal!");
    }, 4500);

    // Instantiate players
    this.initPlayers();

    // Pass out cards
    this.drawHands(this.deck);

    return this.players;
  }

  createDeck(card: Card): CardInterface[] {
    let deck: CardInterface[] = [];
    let createdCard: CardInterface;

    for (const suit in this.cardSuits) {
      for (const value in this.cardValues) {
        createdCard = card.createCard(suit, value);
        deck.push(createdCard);
      }
    }

    return deck;
  }

  /**
   * Shuffle the deck
   *
   * @param timesShuffled number How many times to shuffle the cards. Defaults to 5
   * @param deck array Array of cardInterface objects from the Card class
   *
   * @return array The shuffled deck of cards
   */
  private shuffleDeck(
    timesShuffled: number,
    deck: CardInterface[],
  ): CardInterface[] {
    let n = timesShuffled;

    if (!n) n = 5;

    var l = deck.length,
      r,
      j,
      tmp,
      i;
    for (i = 0; i < n; i++) {
      for (j = 0; j < l; j++) {
        r = Math.floor(Math.random() * l);
        tmp = deck[j];
        deck[j] = deck[r];
        deck[r] = tmp;
      }
    }

    return deck;
  }

  private initPlayers() {
    let playerToPush: PlayerInterface;
    for (let x = 0; x < this.playersCount; x++) {
      playerToPush = this.player.init(x);
      this.players.push(playerToPush);
    }
  }

  public drawHands(deck: CardInterface[]) {
    let cardCount = this.deckCount * 52;
    const cardsPerPlayer = cardCount / this.playersCount;
    for (let x = 0; x <= cardsPerPlayer - 1; x++) {
      this.players.forEach(function (player, _idx, _arr) {
        player.hand.push(deck.shift()!);
      });
    }
  }

  public getPlayers(): PlayerInterface[] {
    return this.players;
  }
}

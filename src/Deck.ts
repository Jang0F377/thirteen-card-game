import {Ora} from 'ora';
import {Card} from './Card';
import {cardSuits, cardValues} from './constants/cards.constants';
import {
  CardInterface,
  DeckCreationOptions,
  DeckObject,
} from './types/deck.types';
import {spinnerLog} from './utils/log.utils';

/**
 * @class Deck Object - handles the creating of the cards
 * as well as shuffling the deck and passing out
 * the cards
 **/
export class Deck {
  timesShuffled: number;
  useJokers: boolean;
  jokerCount: number;
  private cardValues: Record<string, string>;
  private cardSuits: Record<string, string>;
  deckCount: number;
  deck: CardInterface[];
  playersCount: number;
  private card: Card;
  opts: any;

  constructor(options: DeckCreationOptions, card: Card) {
    if (!options.useJokers) delete options.jokerCount;

    const defaults: DeckCreationOptions = {
      timesShuffled: 5,
      useJokers: false,
      jokerCount: undefined,
      deckCount: 1,
      playersCount: 4,
    };

    this.opts = Object.assign({}, defaults, options);
    this.timesShuffled = this.opts.timesShuffled!;
    this.useJokers = this.opts.useJokers!;
    this.jokerCount = this.opts.jokerCount!;
    this.deckCount = this.opts.deckCount!;
    this.cardValues = cardValues;
    this.cardSuits = cardSuits;
    this.playersCount = this.opts.playersCount!;

    this.card = card;
  }

  /**
   * Initialize and shuffle a deck,
   * and return the DeckObject
   *
   * @return object The DeckObject object
   */
  init(): DeckObject {
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
    }, 850);

    setTimeout(() => {
      initSpinner = spinnerLog({
        spinnerType: 'pong',
        spinnerColor: 'cyan',
        spinnerMessage: `Shuffling deck ${this.timesShuffled} times...`,
      }).start();
    }, 1250);

    // Shuffle the deck
    this.shuffleDeck(this.timesShuffled, this.deck);

    setTimeout(() => {
      initSpinner.succeed("Done! Let's deal!");
    }, 2500);

    return {deck: this.deck, config: this.opts};
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

    let l = deck.length,
      r,
      tmp;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < l; j++) {
        r = Math.floor(Math.random() * l);
        tmp = deck[j];
        deck[j] = deck[r];
        deck[r] = tmp;
      }
    }

    return deck;
  }
}

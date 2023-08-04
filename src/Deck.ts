import {Card} from './Card';
import {Player} from './Player';
import {cardValues, cardSuits} from './constants/cards.constants';
import {
  CardInterface,
  PlayerInterface,
  DeckCreationOptions,
} from './types/deck.types';
import {spinnerLog} from './utils/utils';

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

  constructor(options: DeckCreationOptions) {
    delete options.cardValues;
    delete options.cardSuits;
    const defaults: DeckCreationOptions = {
      timesShuffled: 5,
      useJokers: false,
      jokerCount: 2,
      cardValues: cardValues,
      cardSuits: cardSuits,
      deckCount: 1,
      players: 4,
    };

    let opts = Object.assign({}, defaults, options);
    this.timesShuffled = opts.timesShuffled!;
    this.useJokers = opts.useJokers!;
    this.jokerCount = opts.jokerCount!;
    this.deckCount = opts.deckCount!;
    this.cardValues = opts.cardValues!;
    this.cardSuits = opts.cardSuits!;
    this.playersCount = opts.players!;
  }

  /**
   * Initialize and shuffle a deck
   *
   * @return array The CardInterface object
   */
  async init(): Promise<CardInterface[]> {
    let card = new Card(this.cardSuits, this.cardValues);

    // Create the deck
    this.deck = await this.createDeck(card);

    // Shuffle the deck
    await this.shuffleDeck(this.timesShuffled, this.deck);

    // Instantiate players
    await this.initPlayers();

    return this.deck;
  }

  async createDeck(card: Card): Promise<CardInterface[]> {
    let deck: CardInterface[] = [];
    let createdCard: CardInterface;
    const initSpinner = spinnerLog({
      spinnerColor: 'blue',
      spinnerMessage: 'Initializing Deck!',
      spinnerType: 'binary',
    });
    initSpinner.start();
    for (const suit in this.cardSuits) {
      for (const value in this.cardValues) {
        createdCard = await card.createCard(suit, value);
        deck.push(createdCard);
      }
    }

    setTimeout(() => {
      initSpinner.succeed('Deck Initialized.');
    }, 1500);
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
  private async shuffleDeck(
    timesShuffled: number,
    deck: CardInterface[],
  ): Promise<CardInterface[]> {
    let n = timesShuffled;
    const spinner = spinnerLog({
      spinnerType: 'pong',
      spinnerColor: 'cyan',
      spinnerMessage: 'Shuffling deck....',
    });
    spinner.start();
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
    setTimeout(() => {
      spinner.succeed('Done');
    }, 2500);
    return deck;
  }

  private async initPlayers() {
    let player: PlayerInterface;
    for (let x = 0; x < this.playersCount; x++) {
      player = await new Player().init(x);
      this.players.push(player);
    }
  }

  public async drawHands(deck: CardInterface[]) {
    let cardCount = this.deckCount * 52;
    const cardsPerPlayer = cardCount / this.playersCount;
    for (let x = 0; x <= cardsPerPlayer - 1; x++) {
      this.players.forEach(function (player, _idx, _arr) {
        player.hand.push(deck.shift()!);
      });
    }
  }

  public async showHands(): Promise<void> {
    this.players.forEach((player, _idx, _arr) => {
      console.log({...player, count: player.hand.length});
    });
  }
}

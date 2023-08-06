export interface DeckCreationOptions {
  timesShuffled?: number;
  useJokers?: boolean;
  jokerCount?: number; // defaults to 2, undefined if useJokers is false.
  deckCount?: number;
  playersCount?: number;
}

export interface CardInterface {
  value: string;
  valueString: string;
  suit: string;
  suitString: string;
  fullName: string;
  cardUrl?: string;
}

export interface PlayerInterface {
  player: number;
  hand: CardInterface[];
}

export interface DeckObject {
  deck: CardInterface[];
  config: DeckCreationOptions;
}

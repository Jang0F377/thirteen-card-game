export interface DeckCreationOptions {
  timesShuffled?: number;
  useJokers?: boolean;
  jokerCount?: number; // defaults to 2, null if useJokers is false.
  deckCount?: number;
  players?: number;
}

export interface CardInterface {
  value: string;
  valueString: string;
  suit: string;
  suitString: string;
  cardUrl?: string;
}

export interface PlayerInterface {
  player: number;
  hand: CardInterface[];
}

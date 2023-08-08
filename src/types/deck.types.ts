export interface DeckCreationOptions {
  timesShuffled?: number;
  useJokers?: boolean;
  jokerCount?: number; // defaults to 2, undefined if useJokers is false.
  deckCount?: number;
  playersCount?: number;
}

export interface CardObject {
  rank: string;
  rankString: string;
  suit: string;
  suitString: string;
  fullName: string;
  comparableValue: number[];
  cardUrl?: string;
}

export interface DiscardedCardObject extends CardObject {
  playedBy: number;
}

export interface PlayerObject {
  player: number;
  hand: CardObject[];
}

export interface DeckObject {
  deck: CardObject[];
  config: DeckCreationOptions;
}

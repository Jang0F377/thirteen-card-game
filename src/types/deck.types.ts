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
  turnPlayed: number;
}

export interface PlayerObject {
  player: number;
  hand: CardObject[];
}

export interface DeckObject {
  deck: CardObject[];
  config: DeckCreationOptions;
}

export interface TurnType {
  howManyCards: number;
  firstCard: CardObject | null;
  lastCard: CardObject | null;
  lastCardComparableValue: number[] | null;
  playType: string | null;
}

export interface GameState {
  currentTurnState: TurnType;
  playersState: PlayerObject[];
  currentTurnOrder: number[];
  inProgress: boolean;
  placementOutcome: number[];
  turnNumber: number;
  whoHasPower: number | undefined;
  playedCardsPile: DiscardedCardObject[];
}

export interface PossibleCombinations {
  combo: CardObject[];
  description: string;
  strength: number;
}

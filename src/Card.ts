import {cardSuits, cardValues} from './constants/cards.constants';
import {CardInterface} from './types/deck.types';

export class Card {
  private cardSuits: Record<string, string> = cardSuits;
  private cardValues: Record<string, string> = cardValues;

  properName() {}

  createCard(suit: string, value: string): CardInterface {
    let createdCard: CardInterface = {
      suit,
      value,
      suitString: this.cardSuits[suit],
      valueString: this.cardValues[value],
    };

    return createdCard;
  }
}

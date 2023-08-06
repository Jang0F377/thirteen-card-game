import {cardSuits, cardValues} from './constants/cards.constants';
import {CardInterface} from './types/deck.types';

/**
 * @class Card Class - handles the creating of the cards
 **/
export class Card {
  private cardSuits: Record<string, string> = cardSuits;
  private cardValues: Record<string, string> = cardValues;

  createCard(suit: string, value: string): CardInterface {
    const suitString = this.cardSuits[suit];
    const valueString = this.cardValues[value];
    const fullName = `${valueString} of ${suitString}`;
    const createdCard: CardInterface = {
      suit,
      value,
      suitString,
      valueString,
      fullName,
    };

    return createdCard;
  }
}

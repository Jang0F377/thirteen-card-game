import {CardObject} from './types/deck.types';

/**
 * @class Card Class - handles the creating of the cards
 **/
export class Card {
  public createCard(
    suit: string,
    value: string,
    cardSuits: Record<string, string>,
    cardValues: Record<string, string>,
  ): CardObject {
    const suitString = cardSuits[suit];
    const valueString = cardValues[value];
    const fullName = this._returnFullName(suitString, valueString);
    const fullValue = this._giveFullValue(suit, value);
    const createdCard: CardObject = {
      suit: suit,
      rank: value,
      suitString,
      rankString: valueString,
      fullName,
      comparableValue: fullValue,
    };

    return createdCard;
  }

  private _giveFullValue(suit: string, value: string): number[] {
    return this._determineValue(suit, value);
  }

  private _returnFullName(suit: string, value: string): string {
    return `${value} of ${suit}`;
  }

  private _determineValue(suit: string, value: string): number[] {
    let suitValue: number;
    let rankValue: number;

    if (suit === 'D') {
      suitValue = 1;
    } else if (suit === 'C') {
      suitValue = 2;
    } else if (suit === 'H') {
      suitValue = 3;
    } else suitValue = 4;

    if (value === 'J') {
      rankValue = 10;
    } else if (value === 'Q') {
      rankValue = 11;
    } else if (value === 'K') {
      rankValue = 12;
    } else if (value === 'A') {
      rankValue = 13;
    } else {
      rankValue = +value - 1;
    }

    return [rankValue, suitValue];
  }
}

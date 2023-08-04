import {CardInterface} from './types/deck.types';

export class Card {
  constructor(
    private cardSuits: Record<string, string>,
    private cardValues: Record<string, string>,
  ) {}

  properName() {}

  async createCard(suit: string, value: string): Promise<CardInterface> {
    let createdCard: CardInterface = {
      suit,
      value,
      suitString: this.cardSuits[suit],
      valueString: this.cardValues[value],
    };

    return createdCard;
  }
}

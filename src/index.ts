import {Deck} from './Deck';
import {DeckCreationOptions} from './types/deck.types';

async function main() {
  let options: DeckCreationOptions = {
    useJokers: false,
    jokerCount: 0,
  };
  const deck = new Deck(options);
  const createdDeck = await deck.init();
  await deck.drawHands(createdDeck);
  await deck.showHands();
}

main();

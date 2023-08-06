import {Card} from './Card';
import {Deck} from './Deck';
import {Game} from './Game';
import {Player} from './Player';
import {DeckCreationOptions} from './types/deck.types';

// Starting Opts
const options: DeckCreationOptions = {
  timesShuffled: 5, // Default
  deckCount: 1, // Default
  players: 4, // Default
  useJokers: false, // Default
  jokerCount: 2, // null if useJokers false
};
// Entrypoint
function main() {
  let game: Game;
  const player = new Player();
  const card = new Card();
  /**
   * Will instantiate a deck,
   * Shuffle the deck,
   * Pass out the cards between the players
   * */
  const deck = new Deck(options, player, card).init();
  game = new Game(deck);
  game.init();
}

main();

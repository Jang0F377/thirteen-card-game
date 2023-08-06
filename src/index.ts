import {Card} from './Card';
import {Deck} from './Deck';
import {Game} from './Game';
import {Player} from './Player';
import {DeckCreationOptions} from './types/deck.types';

// Starting Opts
const options: DeckCreationOptions = {
  timesShuffled: 5, // Default
  deckCount: 1, // Default
  playersCount: 4, // Default
  useJokers: false, // Default
  jokerCount: 2, // undefined if useJokers false
};

// Entrypoint
function main() {
  let game: Game;
  const player = new Player();
  const card = new Card();
  // Will instantiate and shuffle a deck
  const deck = new Deck(options, card).init();
  // Create new Game and assign to game
  game = new Game(deck, player);
  // Start the game
  game.start();
}

main();

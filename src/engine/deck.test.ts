import Deck from './deck';

test('deck construction', () => {
  const deck = new Deck();
  expect(deck.nextCard).toBe(0);
  expect(deck.deck.length).toBe(13);
});

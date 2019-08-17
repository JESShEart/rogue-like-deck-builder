import Card from './card';
import Character from './character';

export default class Deck {
  public deck: Card[];
  public nextCard: number;  // index of the card at the top of the deck

  constructor() {
    this.nextCard = 0;

    const myEffect = (target: Character) => {
      target.health = target.health - 5;
    };

    this.deck = [
      new Card('Attack0', 1, myEffect),
      new Card('Attack1', 1, myEffect),
      new Card('Attack2', 1, myEffect),
      new Card('Attack3', 1, myEffect),
      new Card('Attack4', 1, myEffect),
      new Card('Attack5', 1, myEffect),
      new Card('Attack6', 1, myEffect),
      new Card('Attack7', 1, myEffect),
      new Card('Attack8', 1, myEffect),
      new Card('Attack9', 1, myEffect),
      new Card('Attack10', 1, myEffect),
      new Card('Attack11', 1, myEffect),
      new Card('Attack12', 1, myEffect),
    ];
  }

  public shuffle(): void {
    return;
  }

}

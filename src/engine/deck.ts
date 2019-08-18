import Card from './card';
import DamageEffect from './effect/damage-effect';

export default class Deck {
  public deck: Card[];
  public nextCard: number;  // index of the card at the top of the deck

  constructor() {
    this.nextCard = 0;

    this.deck = [
      new Card('Attack0', 1, new DamageEffect(5)),
      new Card('Attack1', 1, new DamageEffect(5)),
      new Card('Attack2', 1, new DamageEffect(5)),
      new Card('Attack3', 1, new DamageEffect(5)),
      new Card('Attack4', 1, new DamageEffect(5)),
      new Card('Attack5', 1, new DamageEffect(5)),
      new Card('Attack6', 1, new DamageEffect(5)),
      new Card('Attack7', 1, new DamageEffect(5)),
      new Card('Attack8', 1, new DamageEffect(5)),
      new Card('Attack9', 1, new DamageEffect(5)),
      new Card('Attack10', 1, new DamageEffect(5)),
      new Card('Attack11', 1, new DamageEffect(5)),
      new Card('Attack12', 1, new DamageEffect(5)),
    ];
  }

  public shuffle(): void {
    return;
  }

}

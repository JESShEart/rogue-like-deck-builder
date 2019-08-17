import Character from './character';

export default class Card {
  public cardName: string;
    public cost: number;
  public effect1: (target: Character) => void;
  public hand: boolean;

  constructor(cardName: string, cost: number, effect1: (target: Character) => void) {
    this.cardName = cardName;
    this.cost = cost;
    this.effect1 = effect1;
    this.hand = false;
    }

  public play(target: Character): void {
    this.hand = false;
    this.effect1(target);
  }

}

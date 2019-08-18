import Character from './character';
import IEffect from './effect/effect.interface';

export default class Card {
  public cardName: string;
  public cost: number;
  public effect: IEffect | IEffect[];
  public hand: boolean;

  constructor(cardName: string, cost: number, effect: IEffect | IEffect[]) {
    this.cardName = cardName;
    this.cost = cost;
    this.effect = effect;
    this.hand = false;
  }

  public play(target: Character): void {
    this.hand = false;

    if (this.effect instanceof Array) {
      this.effect.map((e: IEffect) => e.activate(target));
    } else {
      this.effect.activate(target);
    }
  }

}

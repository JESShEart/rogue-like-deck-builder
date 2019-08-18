import Character from '../character';
import IEffect from './effect.interface';

export default class DamageEffect implements IEffect {
  private damage: number;

  constructor(damage: number) {
    this.damage = damage;
  }

  public activate(target: Character) {
    target.health -= this.damage;
  }
}

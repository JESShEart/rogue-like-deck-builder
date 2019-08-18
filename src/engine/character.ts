export default class Character {
  public readonly maxHealth: number;
    public health: number;

  constructor(maxHealth: number) {
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    }
}

import BattleBuilder from '../battle/BattleBuilder';
import IBattle, {Phase} from '../battle/IBattle';
import IBattleHistory from '../battle/IBattleHistory';
import {CardType, ITargetedCard} from '../battle/ICard';
import {CharacterType} from '../battle/ICharacter';
import {EffectType} from '../battle/IEffect';
import IHistory, {InitialHistory} from '../battle/IHistory';

const fiveDamage: ITargetedCard = {
  cardType: CardType.TARGETED,
  cost: 1,
  effectList: [{
    amount: 5,
    effectType: EffectType.DAMAGE_TARGET,
  }],
  name: '5 Damage',
};

const sevenDamage: ITargetedCard = {
  cardType: CardType.TARGETED,
  cost: 2,
  effectList: [{
    amount: 7,
    effectType: EffectType.DAMAGE_TARGET,
  }],
  name: '7 Damage',
};

const battle: IBattle = BattleBuilder.initial()
  .withHero({characterType: CharacterType.HERO, name: 'Hero', health: 100, maxHealth: 100})
  .withEnemy({characterType: CharacterType.ENEMY, name: 'Enemy 1', health: 100, maxHealth: 100})
  .withEnemy({characterType: CharacterType.ENEMY, name: 'Enemy 2', health: 100, maxHealth: 100})
  .withMana(5, 5)
  .withPhase(Phase.PLAYER_ACTION)
  .putCardInHand(fiveDamage)
  .putCardInHand(fiveDamage)
  .putCardInHand(sevenDamage)
  .putCardInHand(sevenDamage)
  .build();

const history: IHistory = new InitialHistory(battle);

export const getInitialBattleHistory = (): IBattleHistory => ({
  battle,
  history,
});

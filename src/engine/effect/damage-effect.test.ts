import Character from '../character';
import DamageEffect from './damage-effect';

test('character takes damage', () => {
  const target = new Character(30);
  const damageEffect = new DamageEffect(25);
  damageEffect.activate(target);
  expect(target.health).toBe(5);
});

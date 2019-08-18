import Card from './card';
import Character from './character';
import DamageEffect from './effect/damage-effect';

test('card played 5 times on same target', () => {
  const effect = new DamageEffect(5);
  const card = new Card('Attack', 1, effect);

  const myTarget = new Character(100);
  card.play(myTarget);
  card.play(myTarget);
  card.play(myTarget);
  card.play(myTarget);
  card.play(myTarget);

  expect(myTarget.health).toBe(75);
});

import Card from './card';
import Character from './character';

test('card played 5 times on same target', () => {
    const effect = (target: Character) => target.health -= 5;
    const card = new Card("Attack", 1, effect);

    const myTarget = new Character(100);
    card.play(myTarget);
    card.play(myTarget);
    card.play(myTarget);
    card.play(myTarget);
    card.play(myTarget);

    expect(myTarget.health).toBe(75);
});

test('failing test example', () => {
    expect(1 + 1).toBe(123);
});

import Card from './card';
import Target from './target';

test('card played 5 times on same target', () => {
    const action = (target: Target) => target.health -= 5;
    const card = new Card(4, action);

    const myTarget = new Target(100);
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

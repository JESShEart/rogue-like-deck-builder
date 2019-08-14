import Target from './target';

export default class Card {
    public cost: number;
    public action: (target: Target) => void;

    constructor(cost: number, action: (target: Target) => void) {
        this.cost = cost;
        this.action = action;
    }

    public play(target: Target): void {
        this.action(target);
    }
}

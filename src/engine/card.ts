import Target from "./target";

export default class Card {
    cost: number;
    action: (target: Target) => void;

    constructor(cost: number, action: (target: Target) => void) {
        this.cost = cost;
        this.action = action;
    }

    play(target: Target): void {
        this.action(target);
    }
}

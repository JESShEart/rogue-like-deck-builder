import Card from './card';

export default class Deck {
    public deck:Card[];
    public nextCard: number;  // index of the card at the top of the deck

    constructor() {
        let deck = new Array[100];
        this.nextCard = 0;
        
        const myEffect = (target: Character) => {
            target.health = target.health - 5;
          }
          
        deck[0] = new Card("Attack0",1,myEffect);
        deck[1] = new Card("Attack1",1,myEffect);
        deck[2] = new Card("Attack2",1,myEffect);
        deck[3] = new Card("Attack3",1,myEffect);
        deck[4] = new Card("Attack4",1,myEffect);
        deck[5] = new Card("Attack5",1,myEffect);
        deck[6] = new Card("Attack6",1,myEffect);
        deck[7] = new Card("Attack7",1,myEffect);
        deck[8] = new Card("Attack8",1,myEffect);
        deck[9] = new Card("Attack9",1,myEffect);
        deck[10] = new Card("Attack10",1,myEffect);
        deck[11] = new Card("Attack11",1,myEffect);
        deck[12] = new Card("Attack12",1,myEffect);   
    }
    
    public shuffle(): void {
        
    }
        
}
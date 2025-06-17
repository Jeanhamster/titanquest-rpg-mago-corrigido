export class Enemy {
    constructor(equation, answer) {
        this.equation = equation;
        this.answer = answer;
        this.health = 100;
    }

    checkAnswer(playerAnswer) {
        return playerAnswer === this.answer;
    }
}
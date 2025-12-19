import p5 from "p5";

export class SynthObject {
    constructor() {
    }

    update(_p: p5): void {
    }

    draw(p: p5, tex: p5.Graphics): void {
        tex.push();
        tex.pop();
    }
}
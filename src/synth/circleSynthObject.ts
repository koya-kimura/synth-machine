import p5 from "p5";
import type { SynthParams } from "./synthTypes";
import { BaseSynthObject } from "./baseSynthObject";

/**
 * CircleSynthObject - 円形のシンセサイザービジュアルオブジェクト
 * 
 * 基本的な円を描画します。元のSynthObjectと同等の機能を持ちます。
 */
export class CircleSynthObject extends BaseSynthObject {
    /**
     * CircleSynthObjectを生成
     */
    constructor(
        x: number,
        y: number,
        startTime: number,
        bpm: number,
        params: SynthParams,
        baseSize: number = 50
    ) {
        super(x, y, startTime, bpm, params, baseSize);
    }

    /**
     * 円を描画
     */
    display(p: p5, tex: p5.Graphics): void {
        const radius = this.calculateUniformSize(p);

        this.setupDrawing(tex);
        tex.circle(this.x, this.y, radius * 2);
        this.finishDrawing(tex);
    }
}

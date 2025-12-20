import p5 from "p5";
import type { SynthParams, MovementParams } from "./synthTypes";
import { BaseSynthObject } from "./baseSynthObject";

/**
 * CircleSynthObject - 円形のシンセサイザービジュアルオブジェクト
 * 
 * 基本的な円を描画します。元のSynthObjectと同等の機能を持ちます。
 */
export class CircleSynthObject extends BaseSynthObject {
    /**
     * CircleSynthObjectを生成
     * 
     * @param x - X座標
     * @param y - Y座標
     * @param startTime - 生成時刻
     * @param bpm - BPM
     * @param params - シンセサイザーパラメータ
     * @param baseSize - 基本サイズ（半径）
     * @param movementParams - 移動パラメータ（オプショナル）
     */
    constructor(
        x: number,
        y: number,
        startTime: number,
        bpm: number,
        params: SynthParams,
        baseSize: number = 50,
        movementParams?: MovementParams
    ) {
        super(x, y, startTime, bpm, params, baseSize, movementParams);
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

import p5 from "p5";
import type { SynthParams, MovementParams } from "./synthTypes";
import { BaseSynthObject } from "./baseSynthObject";

/**
 * 円/楕円固有のパラメータ
 */
export interface EllipseParams {
    /** アスペクト比（幅/高さ、1.0=正円、>1=横長、<1=縦長） */
    aspectRatio?: number;
}

/**
 * CircleSynthObject - 円形/楕円形のシンセサイザービジュアルオブジェクト
 * 
 * 基本的な円を描画します。aspectRatioを指定すると楕円になります。
 */
export class CircleSynthObject extends BaseSynthObject {
    /** アスペクト比（幅/高さ） */
    private aspectRatio: number;

    /**
     * CircleSynthObjectを生成
     * 
     * @param startTime - 生成時刻
     * @param bpm - BPM
     * @param x - X座標
     * @param y - Y座標
     * @param baseSize - 基本サイズ（半径、デフォルト: 50）
     * @param params - シンセサイザーパラメータ（オプショナル）
     * @param movementParams - 移動パラメータ（オプショナル）
     * @param ellipseParams - 楕円パラメータ（オプショナル）
     */
    constructor(
        startTime: number,
        bpm: number,
        x: number,
        y: number,
        baseSize: number = 50,
        params: SynthParams = {},
        movementParams?: MovementParams,
        ellipseParams?: EllipseParams
    ) {
        super(startTime, bpm, x, y, baseSize, params, movementParams);
        this.aspectRatio = ellipseParams?.aspectRatio ?? 1.0;
    }

    /**
     * 円/楕円を描画
     */
    display(p: p5, tex: p5.Graphics): void {
        const size = this.calculateUniformSize(p);

        // アスペクト比に基づいて幅と高さを計算
        const width = size * 2 * this.aspectRatio;
        const height = size * 2;

        this.setupDrawing(tex);
        tex.ellipse(this.x, this.y, width, height);
        this.finishDrawing(tex);
    }
}

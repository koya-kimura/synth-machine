import p5 from "p5";
import type { SynthObjectConfig } from "./synthTypes";
import { BaseSynthObject } from "./baseSynthObject";

/**
 * 円/楕円固有のパラメータ
 */
export interface EllipseParams {
    /** アスペクト比（幅/高さ、1.0=正円、>1=横長、<1=縦長） */
    aspectRatio?: number;
}

/**
 * CircleSynthObjectの設定
 */
export interface CircleConfig extends SynthObjectConfig {
    /** 楕円パラメータ（オプショナル） */
    ellipse?: EllipseParams;
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
     * @param config - オブジェクト設定
     */
    constructor(config: CircleConfig) {
        super(config);
        this.aspectRatio = config.ellipse?.aspectRatio ?? 1.0;
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

        // 回転を適用（ラジアン）
        tex.translate(this.x, this.y);
        tex.rotate(this.rotationAngle);
        tex.ellipse(0, 0, width, height);

        this.finishDrawing(tex);
    }
}

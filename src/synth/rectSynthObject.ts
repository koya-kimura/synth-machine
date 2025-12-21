import p5 from "p5";
import type { SynthObjectConfig } from "./synthTypes";
import { BaseSynthObject } from "./baseSynthObject";

/**
 * 長方形固有のパラメータ
 */
export interface RectParams {
    /** 伸縮モード（デフォルト: 'uniform'）
     * - 'uniform': 幅と高さ両方にADSR/LFOを適用
     * - 'horizontal': 幅のみにADSR/LFOを適用（高さは固定）
     * - 'vertical': 高さのみにADSR/LFOを適用（幅は固定）
     */
    stretchMode?: 'uniform' | 'horizontal' | 'vertical';
    /** アスペクト比（幅/高さ、デフォルト: 1.0） */
    aspectRatio?: number;
}

/**
 * RectSynthObjectの設定
 */
export interface RectConfig extends SynthObjectConfig {
    /** 長方形パラメータ（オプショナル） */
    rect?: RectParams;
}

/**
 * RectSynthObject - 長方形のシンセサイザービジュアルオブジェクト
 * 
 * 幅と高さを独立して制御できる長方形を描画します。
 * 伸縮モードにより、細長く伸びるアニメーションなどが可能です。
 */
export class RectSynthObject extends BaseSynthObject {
    /** 長方形固有のパラメータ（解決済み） */
    private rectParams: Required<RectParams>;

    /**
     * RectSynthObjectを生成
     * 
     * @param config - オブジェクト設定
     */
    constructor(config: RectConfig) {
        super(config);

        // デフォルト値を適用
        this.rectParams = {
            stretchMode: config.rect?.stretchMode ?? 'uniform',
            aspectRatio: config.rect?.aspectRatio ?? 1.0,
        };
    }

    /**
     * 長方形を描画
     */
    display(p: p5, tex: p5.Graphics): void {
        const { width, height } = this.calculateDimensions(p);

        this.setupDrawing(tex);

        // 回転を適用（ラジアン）
        tex.translate(this.x, this.y);
        tex.rotate(this.rotationAngle);
        tex.rectMode(p.CENTER);
        tex.rect(0, 0, width, height);

        this.finishDrawing(tex);
    }

    /**
     * 長方形の幅と高さを計算
     * 
     * stretchMode:
     * - uniform: 幅と高さ両方にADSR/LFOを適用
     * - horizontal: 幅のみにADSR/LFOを適用（高さは固定）
     * - vertical: 高さのみにADSR/LFOを適用（幅は固定）
     */
    private calculateDimensions(p: p5): { width: number; height: number } {
        // 基本サイズ（ADSR/LFO適用なし）
        const baseW = this.baseSize * this.rectParams.aspectRatio;
        const baseH = this.baseSize;

        // ADSR + LFO による変調
        const lfo = this.calculateLFO(p);
        const modulation = this.currentLevel + lfo / this.baseSize;

        let width: number;
        let height: number;

        switch (this.rectParams.stretchMode) {
            case 'uniform':
                // 均一: 幅と高さ両方にADSR/LFOを適用
                width = baseW * modulation;
                height = baseH * modulation;
                break;
            case 'horizontal':
                // 水平: 幅のみにADSR/LFOを適用（高さは固定）
                width = baseW * modulation;
                height = baseH;
                break;
            case 'vertical':
                // 垂直: 高さのみにADSR/LFOを適用（幅は固定）
                width = baseW;
                height = baseH * modulation;
                break;
            default:
                width = baseW * modulation;
                height = baseH * modulation;
        }

        return { width: Math.max(1, width), height: Math.max(1, height) };
    }
}

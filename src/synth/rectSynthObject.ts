import p5 from "p5";
import type { SynthParams, MovementParams } from "./synthTypes";
import { BaseSynthObject } from "./baseSynthObject";

/**
 * 長方形固有のパラメータ
 */
export interface RectParams {
    /** 伸縮モード: 'uniform'=均一, 'horizontal'=水平, 'vertical'=垂直 */
    stretchMode?: 'uniform' | 'horizontal' | 'vertical';
    /** アスペクト比（幅/高さ、デフォルト: 1.0） */
    aspectRatio?: number;
    /** 幅のLFOレート（Hz、デフォルト: 0） */
    lfoWidthRate?: number;
    /** 幅のLFO深度（ピクセル、デフォルト: 0） */
    lfoWidthDepth?: number;
    /** 高さのLFOレート（Hz、デフォルト: 0） */
    lfoHeightRate?: number;
    /** 高さのLFO深度（ピクセル、デフォルト: 0） */
    lfoHeightDepth?: number;
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
     * @param startTime - 生成時刻
     * @param bpm - BPM
     * @param x - X座標
     * @param y - Y座標
     * @param baseSize - 基本サイズ（デフォルト: 50）
     * @param params - シンセサイザーパラメータ（オプショナル）
     * @param rectParams - 長方形固有のパラメータ（オプショナル）
     * @param movementParams - 移動パラメータ（オプショナル）
     */
    constructor(
        startTime: number,
        bpm: number,
        x: number,
        y: number,
        baseSize: number = 50,
        params: SynthParams = {},
        rectParams: RectParams = {},
        movementParams?: MovementParams
    ) {
        super(startTime, bpm, x, y, baseSize, params, movementParams);

        // デフォルト値を適用
        this.rectParams = {
            stretchMode: rectParams.stretchMode ?? 'uniform',
            aspectRatio: rectParams.aspectRatio ?? 1.0,
            lfoWidthRate: rectParams.lfoWidthRate ?? 0,
            lfoWidthDepth: rectParams.lfoWidthDepth ?? 0,
            lfoHeightRate: rectParams.lfoHeightRate ?? 0,
            lfoHeightDepth: rectParams.lfoHeightDepth ?? 0,
        };
    }

    /**
     * 長方形を描画
     */
    display(p: p5, tex: p5.Graphics): void {
        const { width, height } = this.calculateDimensions(p);

        this.setupDrawing(tex);
        tex.rectMode(p.CENTER);
        tex.rect(this.x, this.y, width, height);
        this.finishDrawing(tex);
    }

    /**
     * 長方形の幅と高さを計算
     */
    private calculateDimensions(p: p5): { width: number; height: number } {
        const time = (p.millis() - this.startTime) / 1000;

        // 基本サイズにADSRレベルを適用
        const baseW = this.baseSize * this.currentLevel * this.rectParams.aspectRatio;
        const baseH = this.baseSize * this.currentLevel;

        let width = baseW;
        let height = baseH;

        // 伸縮モードに応じてLFOを適用
        switch (this.rectParams.stretchMode) {
            case 'uniform': {
                // 均一: 共通のLFOを適用
                const lfo = this.calculateLFO(p);
                width += lfo * this.rectParams.aspectRatio;
                height += lfo;
                break;
            }
            case 'horizontal': {
                // 水平: 幅にのみLFOを適用
                const lfoW = Math.sin(time * this.rectParams.lfoWidthRate * Math.PI * 2) * this.rectParams.lfoWidthDepth;
                width += lfoW;
                // 高さにも少し影響
                const lfoH = Math.sin(time * this.rectParams.lfoHeightRate * Math.PI * 2) * this.rectParams.lfoHeightDepth * 0.3;
                height += lfoH;
                break;
            }
            case 'vertical': {
                // 垂直: 高さにのみLFOを適用
                const lfoH = Math.sin(time * this.rectParams.lfoHeightRate * Math.PI * 2) * this.rectParams.lfoHeightDepth;
                height += lfoH;
                // 幅にも少し影響
                const lfoW = Math.sin(time * this.rectParams.lfoWidthRate * Math.PI * 2) * this.rectParams.lfoWidthDepth * 0.3;
                width += lfoW;
                break;
            }
        }

        return { width: Math.max(1, width), height: Math.max(1, height) };
    }
}

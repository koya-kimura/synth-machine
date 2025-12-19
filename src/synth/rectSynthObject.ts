import p5 from "p5";
import type { SynthParams } from "./synthTypes";
import { BaseSynthObject } from "./baseSynthObject";

/**
 * 長方形固有のパラメータ
 */
export interface RectParams {
    /** 基本幅（ピクセル） */
    baseWidth: number;
    /** 基本高さ（ピクセル） */
    baseHeight: number;
    /** 伸縮モード: 'uniform'=均一, 'horizontal'=水平, 'vertical'=垂直 */
    stretchMode: 'uniform' | 'horizontal' | 'vertical';
    /** 幅のLFOレート（Hz） */
    lfoWidthRate: number;
    /** 幅のLFO深度（ピクセル） */
    lfoWidthDepth: number;
    /** 高さのLFOレート（Hz） */
    lfoHeightRate: number;
    /** 高さのLFO深度（ピクセル） */
    lfoHeightDepth: number;
}

/**
 * RectSynthObject - 長方形のシンセサイザービジュアルオブジェクト
 * 
 * 幅と高さを独立して制御できる長方形を描画します。
 * 伸縮モードにより、細長く伸びるアニメーションなどが可能です。
 */
export class RectSynthObject extends BaseSynthObject {
    /** 長方形固有のパラメータ */
    private rectParams: RectParams;

    /**
     * RectSynthObjectを生成
     * 
     * @param x - X座標
     * @param y - Y座標
     * @param startTime - 生成時刻
     * @param bpm - BPM
     * @param params - シンセサイザーパラメータ
     * @param rectParams - 長方形固有のパラメータ
     */
    constructor(
        x: number,
        y: number,
        startTime: number,
        bpm: number,
        params: SynthParams,
        rectParams: RectParams
    ) {
        // baseSizeは使用しないが、互換性のため0を渡す
        super(x, y, startTime, bpm, params, 0);
        this.rectParams = rectParams;
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
        let baseW = this.rectParams.baseWidth * this.currentLevel;
        let baseH = this.rectParams.baseHeight * this.currentLevel;

        // 伸縮モードに応じてLFOを適用
        switch (this.rectParams.stretchMode) {
            case 'uniform': {
                // 均一: 共通のLFOを適用
                const lfo = this.calculateLFO(p);
                baseW += lfo;
                baseH += lfo;
                break;
            }
            case 'horizontal': {
                // 水平: 幅にのみLFOを適用
                const lfoW = Math.sin(time * this.rectParams.lfoWidthRate * Math.PI * 2) * this.rectParams.lfoWidthDepth;
                baseW += lfoW;
                break;
            }
            case 'vertical': {
                // 垂直: 高さにのみLFOを適用
                const lfoH = Math.sin(time * this.rectParams.lfoHeightRate * Math.PI * 2) * this.rectParams.lfoHeightDepth;
                baseH += lfoH;
                break;
            }
        }

        // 幅と高さにそれぞれ独立したLFOを追加（stretchMode関係なく）
        if (this.rectParams.stretchMode !== 'uniform') {
            const lfoW = Math.sin(time * this.rectParams.lfoWidthRate * Math.PI * 2) * this.rectParams.lfoWidthDepth;
            const lfoH = Math.sin(time * this.rectParams.lfoHeightRate * Math.PI * 2) * this.rectParams.lfoHeightDepth;

            if (this.rectParams.stretchMode === 'vertical') {
                baseW += lfoW * 0.3; // 垂直モードでも少し幅に影響
            } else if (this.rectParams.stretchMode === 'horizontal') {
                baseH += lfoH * 0.3; // 水平モードでも少し高さに影響
            }
        }

        return { width: Math.max(1, baseW), height: Math.max(1, baseH) };
    }
}

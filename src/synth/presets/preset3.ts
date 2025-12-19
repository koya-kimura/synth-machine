import p5 from "p5";
import { SynthObject } from "../object";
import type { SynthParams } from "../synthTypes";

/**
 * プリセット3: 3x3グリッド円
 * 緑系のグラデーションで9つの円をグリッド状に配置
 */
export const createGridCirclesPreset = (p: p5, bpm: number, startTime: number): SynthObject[] => {
    const spacing = 80; // 円の間隔
    const objects: SynthObject[] = [];

    // 全ての円の基本パラメータ
    const baseParams: SynthParams = {
        attackTime: 0.3,
        decayTime: 0.2,
        sustainLevel: 0.5,
        releaseTime: 0.6,
        noteDuration: 1.5,
        waveform: 'sine',
        lfoRate: 4.0,
        lfoDepth: 3,
        colorParams: {
            hue: 120,
            saturation: 75,
            brightness: 90,
        },
    };

    const centerX = p.width / 2;
    const centerY = p.height / 2;

    // 3x3グリッドで配置
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const x = centerX + (col - 1) * spacing;
            const y =centerY + (row - 1) * spacing;
            const hue = 100 + (row * 3 + col) * 10; // 100-180の範囲で色相を変化

            objects.push(new SynthObject(
                x,
                y,
                startTime + (row * 3 + col) * 20, // 少しずつタイミングをずらす
                bpm,
                { ...baseParams, colorParams: { hue, saturation: 75, brightness: 90 } },
                30
            ));
        }
    }

    return objects;
};

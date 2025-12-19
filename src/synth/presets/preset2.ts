import p5 from "p5";
import { SynthObject } from "../object";
import type { SynthParams } from "../synthTypes";

/**
 * プリセット2: 3つ縦並び円
 * ピンク系のグラデーションで3つの円を縦に配置
 */
export const createVerticalCirclesPreset = (_p: p5, centerX: number, centerY: number, bpm: number, startTime: number): SynthObject[] => {
    const spacing = 100; // 円の間隔
    const objects: SynthObject[] = [];

    // 全ての円の基本パラメータ
    const baseParams: SynthParams = {
        attackTime: 0.4,
        decayTime: 0.4,
        sustainLevel: 0.7,
        releaseTime: 1.0,
        noteDuration: 2.5,
        waveform: 'sine',
        lfoRate: 3.0,
        lfoDepth: 8,
        colorParams: {
            hue: 320,
            saturation: 70,
            brightness: 95,
        },
    };

    // 上の円
    objects.push(new SynthObject(
        centerX,
        centerY - spacing,
        startTime,
        bpm,
        { ...baseParams, colorParams: { hue: 300, saturation: 70, brightness: 95 } },
        45
    ));

    // 中央の円
    objects.push(new SynthObject(
        centerX,
        centerY,
        startTime,
        bpm,
        { ...baseParams, colorParams: { hue: 320, saturation: 70, brightness: 95 } },
        45
    ));

    // 下の円
    objects.push(new SynthObject(
        centerX,
        centerY + spacing,
        startTime,
        bpm,
        { ...baseParams, colorParams: { hue: 340, saturation: 70, brightness: 95 } },
        45
    ));

    return objects;
};

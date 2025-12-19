import p5 from "p5";
import { SynthObject } from "../object";
import type { SynthParams } from "../synthTypes";

/**
 * プリセット1: 3つ横並び円
 * 水色系のグラデーションで3つの円を横に配置
 */
export const createThreeCirclesPreset = (_p: p5, centerX: number, centerY: number, bpm: number, startTime: number): SynthObject[] => {
    const spacing = 100; // 円の間隔
    const objects: SynthObject[] = [];

    // 全ての円の基本パラメータ
    const baseParams: SynthParams = {
        attackTime: 0.5,
        decayTime: 0.3,
        sustainLevel: 0.6,
        releaseTime: 0.8,
        noteDuration: 2.0,
        waveform: 'sine',
        lfoRate: 2.0,
        lfoDepth: 5,
        colorParams: {
            hue: 180,
            saturation: 80,
            brightness: 100,
        },
    };

    // 左の円
    objects.push(new SynthObject(
        centerX - spacing,
        centerY,
        startTime,
        bpm,
        { ...baseParams, colorParams: { hue: 160, saturation: 80, brightness: 100 } },
        50
    ));

    // 中央の円
    objects.push(new SynthObject(
        centerX,
        centerY,
        startTime,
        bpm,
        { ...baseParams, colorParams: { hue: 180, saturation: 80, brightness: 100 } },
        50
    ));

    // 右の円
    objects.push(new SynthObject(
        centerX + spacing,
        centerY,
        startTime,
        bpm,
        { ...baseParams, colorParams: { hue: 200, saturation: 80, brightness: 100 } },
        50
    ));

    return objects;
};

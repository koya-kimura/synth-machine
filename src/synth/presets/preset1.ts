import p5 from "p5";
import { SynthObject } from "../object";
import type { SynthParams } from "../synthTypes";

/**
 * プリセット1: 3つ横並び円
 * 水色系のグラデーションで3つの円を横に配置
 */
export const createThreeCirclesPreset = (_p: p5, centerX: number, centerY: number, bpm: number, startTime: number): SynthObject[] => {
    const objects: SynthObject[] = [];

    objects.push(new SynthObject(
        centerX,
        centerY,
        startTime,
        bpm,
        {
            attackTime: 0.1,
            decayTime: 0.0,
            sustainLevel: 1.0,
            releaseTime: 0.5,
            noteDuration: 2.0,
            waveform: 'sine',
            lfoRate: 0.01,
            lfoDepth: 1,
            colorParams: {
                hue: 180,
                saturation: 80,
                brightness: 100,
            },
        },
        50
    ));

    return objects;
};

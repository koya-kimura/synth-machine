import p5 from "p5";
import { SynthObject } from "../object";
import type { SynthParams } from "../synthTypes";

/**
 * プリセット1: 3つ横並び円
 * 水色系のグラデーションで3つの円を横に配置
 */
export const createThreeCirclesPreset = (p: p5, bpm: number, startTime: number): SynthObject[] => {
    const objects: SynthObject[] = [];

    objects.push(new SynthObject(
        p.width / 2,  // 画面中央X
        p.height / 2, // 画面中央Y
        startTime,
        bpm,
        {
            attackTime: 1.0,
            decayTime: 0.0,
            sustainLevel: 1.0,
            releaseTime: 0.5,
            noteDuration: 2.0,
            waveform: 'sine',
            lfoRate: 100,
            lfoDepth: 10,
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

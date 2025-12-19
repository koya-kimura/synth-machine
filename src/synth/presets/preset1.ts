import p5 from "p5";
import { BaseSynthObject, CircleSynthObject } from "../object";

/**
 * プリセット1: シンプルな円
 * 水色系の円を画面中央に配置
 */
export const createThreeCirclesPreset = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    const objects: BaseSynthObject[] = [];

    objects.push(new CircleSynthObject(
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

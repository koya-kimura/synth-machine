import p5 from "p5";
import { BaseSynthObject, RectSynthObject, type RectParams } from "../object";
import type { SynthParams } from "../synthTypes";

/**
 * プリセット2: 水平に伸縮する長方形
 * 細長い長方形が左右に伸びるアニメーション
 */
export const createVerticalCirclesPreset = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    const objects: BaseSynthObject[] = [];

    // シンセパラメータ
    const synthParams: SynthParams = {
        attackTime: 0.5,
        decayTime: 0.2,
        sustainLevel: 0.8,
        releaseTime: 1.0,
        noteDuration: 2.0,
        waveform: 'sine',
        lfoRate: 2,
        lfoDepth: 5,
        colorParams: {
            hue: 320,       // ピンク
            saturation: 80,
            brightness: 100,
        },
    };

    // 長方形パラメータ（水平に伸縮）
    const rectParams: RectParams = {
        baseWidth: 200,
        baseHeight: 30,
        stretchMode: 'horizontal',
        lfoWidthRate: 1.5,
        lfoWidthDepth: 80,
        lfoHeightRate: 3,
        lfoHeightDepth: 10,
    };

    objects.push(new RectSynthObject(
        p.width / 2,
        p.height / 2,
        startTime,
        bpm,
        synthParams,
        rectParams
    ));

    return objects;
};

import p5 from "p5";
import { BaseSynthObject, CircleSynthObject } from "../object";

/**
 * プリセット: kick01
 * シンプルなキックのビジュアル
 */
export const kick01 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    const objects: BaseSynthObject[] = [];

    objects.push(new CircleSynthObject(
        startTime,
        bpm,
        p.width / 2,      // 画面中央X
        p.height / 2,     // 画面中央Y
        Math.min(p.width, p.height) * 0.4,              // サイズ
        {
            attackTime: 0.02,
            decayTime: 0.5,
            releaseTime: 0.0675,
            noteDuration: 0.0,
            colorParams: {
                paletteColor: 'RED',
            },
        }
    ));

    return objects;
};

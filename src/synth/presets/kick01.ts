import p5 from "p5";
import { BaseSynthObject, CircleSynthObject } from "../object";

/**
 * プリセット: kick01
 * シンプルなキックのビジュアル
 */
export const kick01 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    return [
        new CircleSynthObject({
            startTime,
            bpm,
            x: p.width / 2,
            y: p.height / 2,
            size: Math.min(p.width, p.height) * 0.4,
            angle: 0,
            params: {
                attackTime: 0.02,
                decayTime: 0.5,
                releaseTime: 0.0675,
                colorParams: {
                    paletteColor: 'RED',
                },
            },
        })
    ];
};

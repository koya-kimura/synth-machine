import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";

/**
 * プリセット: kick02
 * 多角形のキックビジュアル
 */
export const kick02 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    const objects: BaseSynthObject[] = [];

    objects.push(new PolygonSynthObject(
        startTime,
        bpm,
        p.width / 2,      // 画面中央X
        p.height / 2,     // 画面中央Y
        Math.min(p.width, p.height) * 0.4,  // サイズ
        {
            attackTime: 0.05,
            decayTime: 0.25,
            sustainLevel: 0.95,
            releaseTime: 1.0,
            noteDuration: 0.0,
            lfoType: 'sine',
            lfoRate: 0.5,
            lfoDepth: 0.5,
            colorParams: {
                paletteColor: 'BLUE',
            },
        },
        { sides: 10 }      // 六角形
    ));

    return objects;
};

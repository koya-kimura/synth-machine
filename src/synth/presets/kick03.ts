import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";

/**
 * プリセット: kick03
 * 多角形のキックビジュアル
 */
export const kick03 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    const objects: BaseSynthObject[] = [];

    objects.push(new PolygonSynthObject(
        startTime,
        bpm,
        p.width / 2,      // 画面中央X
        p.height / 2,     // 画面中央Y
        Math.min(p.width, p.height) * 0.3,  // サイズ
        {
            attackTime: 0.02,
            decayTime: 0.5,
            sustainLevel: 0.8,
            releaseTime: 0.0,
            noteDuration: 0.0,
            lfoType: 'square',
            lfoRate: 8.0,
            lfoDepth: 0.1,
            colorParams: {
                paletteColor: 'YELLOW',
            },
        },
        { sides: 4 }      // 四角形
    ));

    return objects;
};

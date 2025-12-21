import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: snare03
 * 放射状に広がる円
 */
export const snare03 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    for (let i of [-1, 1]) {
        const s = p.height * 0.3;
        const x = p.width * (0.5 + 0.5 * map(i, -1, 1, 1, -1));
        const y = p.height * 0.5;

        objects.push(
            new PolygonSynthObject({
                startTime,
                bpm,
                x: x,
                y: y,
                size: s,
                angle: 0,
                params: {
                    attackTime: 0.05,
                    decayTime: 0.25,
                    sustainLevel: 0.5,
                    releaseTime: 0.25,
                    lfoType: 'square',
                    lfoRate: 4.0,
                    lfoDepth: 0.5,
                    colorParams: {
                        paletteColor: 'CYAN',
                    },
                },
                polygon: {
                    sides: 6,
                }
            })
        );
    }
    return objects;
};

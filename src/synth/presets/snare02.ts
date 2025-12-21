import p5 from "p5";
import { BaseSynthObject, RectSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: snare02
 * 放射状に広がる円
 */
export const snare02 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    for (let i of [-1, 1]) {
        const h = p.height * 0.1;
        const w = p.width;
        const x = p.width / 2;
        const y = p.height * (0.5 + 0.5 * map(i, -1, 1, 1, -1)) + i * h / 2;
        const asp = w / h;

        objects.push(
            new RectSynthObject({
                startTime,
                bpm,
                x: x,
                y: y,
                size: h,
                angle: 0,
                params: {
                    attackTime: 0.05,
                    decayTime: 0.25,
                    sustainLevel: 0.5,
                    releaseTime: 0.25,
                    lfoType: 'square',
                    lfoRate: 512.0,
                    lfoDepth: 0.1,
                    colorParams: {
                        paletteColor: 'PURPLE',
                    },
                },
                rect: {
                    aspectRatio: asp,
                    stretchMode: 'horizontal',
                }
            })
        );
    }
    return objects;
};

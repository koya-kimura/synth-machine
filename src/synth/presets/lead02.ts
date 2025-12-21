import p5 from "p5";
import { BaseSynthObject, CircleSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: lead02
 * 放射状に広がる円
 */
export const lead02 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 5;
    for (let i = 0; i < n; i++) {
        const x = p.width * ((i + 0.5) / n);
        const y = p.height * 0;
        const s = p.width * 0.02;
        const r = map(UniformRandom.rand(i, startTime), 0, 1, 1.0, 7.0);

        objects.push(
            new CircleSynthObject({
                startTime,
                bpm,
                x: x,
                y: y,
                size: s,
                angle: 0,
                params: {
                    attackTime: 0,
                    decayTime: 1.0,
                    sustainLevel: 1.0,
                    releaseTime: 0,
                    lfoType: 'square',
                    lfoRate: r,
                    lfoDepth: 1.0,
                    colorParams: {
                        paletteColor: 'YELLOW',
                    },
                },
                movement: {
                    angle: Math.PI * 0.5,
                    distance: p.height,
                }
            })
        );
    }

    return objects;
};

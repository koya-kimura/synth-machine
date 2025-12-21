import p5 from "p5";
import { BaseSynthObject, CircleSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: pad01
 * 放射状に広がる円
 */
export const pad01 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 5;
    for (let i = 0; i < n; i++) {
        const x = p.width * 0.5;
        const y = p.height * 0.5;
        const s = p.width * 0.35;
        const r = map(UniformRandom.rand(i, startTime), 0, 1, 1.0, 7.0);
        const attackTime = 0.5 * map(i, 0, n - 1, 0.2, 1);
        const releaseTime = 1.0 - attackTime + 0.5;

        objects.push(
            new CircleSynthObject({
                startTime,
                bpm,
                x: x,
                y: y,
                size: s,
                angle: 0,
                params: {
                    attackTime: attackTime,
                    decayTime: 0,
                    sustainLevel: 1.0,
                    releaseTime: releaseTime,
                    lfoType: 'square',
                    lfoRate: r,
                    lfoDepth: 0.1,
                    colorParams: {
                        paletteColor: 'ORANGE',
                    },
                },
                style: {
                    mode: 'stroke',
                    strokeWeight: 10,
                }
            })
        );
    }

    return objects;
};

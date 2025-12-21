import p5 from "p5";
import { BaseSynthObject, CircleSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: bass02
 * 放射状に広がる円
 */
export const bass02 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 100;
    for (let i = 0; i < n; i++) {
        const x = p.width * 0.5;
        const y = p.height * map(i, 0, n - 1, -0.1, 1.1);
        const s = p.height * map(Math.abs(i - n / 2), n / 2, 0, 0.5, 10.0) / n;
        const angle = Math.PI * 0.5;

        objects.push(
            new CircleSynthObject({
                startTime,
                bpm,
                x: x,
                y: y,
                size: s,
                angle: angle,
                params: {
                    attackTime: 0.5,
                    decayTime: 0.0,
                    sustainLevel: 1.0,
                    releaseTime: 1.0,
                    lfoType: 'sine',
                    lfoRate: 2.78,
                    lfoDepth: 3.0,
                    colorParams: {
                        paletteColor: 'GREEN',
                    },
                }
            })
        );
    }
    return objects;
};

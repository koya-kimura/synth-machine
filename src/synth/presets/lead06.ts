import p5 from "p5";
import { BaseSynthObject, RectSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: lead06
 * 放射状に広がる円
 */
export const lead06 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 41;
    for (let i = 0; i < n; i++) {
        const x = p.width * (i + 0.5) / n;;
        const y = i % 2 == 0 ? 0 : p.height;
        const s = p.width / n * 0.5 * 20.0;
        const r = map(UniformRandom.rand(i, startTime), 0, 1, 1.0, 7.0);
        const attackTime = 0.5 * map(UniformRandom.rand(startTime, i), 0, 1, 0.2, 1);
        const releaseTime = 1.0 - attackTime + 0.5;

        objects.push(
            new RectSynthObject({
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
                    lfoType: 'sine',
                    lfoRate: r,
                    lfoDepth: 0.2,
                    colorParams: {
                        paletteColor: 'YELLOW',
                    },
                },
                style: {
                    mode: 'stroke',
                    strokeWeight: Math.min(p.width, p.height) * 0.01,
                },
                rect: {
                    stretchMode: 'vertical',
                    aspectRatio: 0.1,
                }
            })
        );
    }

    return objects;
};

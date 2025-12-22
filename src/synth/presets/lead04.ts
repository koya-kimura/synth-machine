import p5 from "p5";
import { BaseSynthObject, RectSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: lead04
 * 放射状に広がる円
 */
export const lead04 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const m = 4;
    const n = 100;
    for (let j = 0; j < m; j++) {
        for (let i = 0; i < n; i++) {
            const x = p.width * ((i + 0.5) / n);
            const a = startTime * 4.74 + i * Math.PI * 2 / n + Math.PI * 2.0 * j / m;
            const y = p.height * 0.5 + Math.sin(a) * p.height * 0.2;
            const s = p.width * 0.02;
            const angle = a + Math.PI * 0.5;

            objects.push(
                new RectSynthObject({
                    startTime,
                    bpm,
                    x: x,
                    y: y,
                    size: s,
                    angle: angle,
                    params: {
                        attackTime: 0.5,
                        decayTime: 0.5,
                        sustainLevel: 0.2,
                        releaseTime: 0.5,
                        lfoType: 'saw',
                        lfoRate: 8.0,
                        lfoDepth: 3.0,
                        colorParams: {
                            paletteColor: 'PINK',
                        },
                    },
                    rect: {
                        stretchMode: 'horizontal',
                    },
                })
            );
        }
    }
    return objects;
};

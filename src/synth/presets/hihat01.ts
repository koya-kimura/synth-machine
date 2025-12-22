import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: hihat01
 * 放射状に広がる円
 */
export const hihat01 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = Math.floor(map(UniformRandom.rand(startTime), 0, 1, 4, 8));
    for (let i = 0; i < n; i++) {
        const angle = Math.PI * 2 * i / n;
        const cx = map(UniformRandom.rand(startTime, 5271), 0, 1, 0.05, 0.95) * p.width;
        const cy = map(UniformRandom.rand(startTime, 7942), 0, 1, 0.05, 0.95) * p.height;
        const r = Math.min(p.width, p.height) * 0.1;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const s = p.height * 0.05;

        objects.push(
            new PolygonSynthObject({
                startTime,
                bpm,
                x: x,
                y: y,
                size: s,
                angle: angle,
                params: {
                    attackTime: 0.01,
                    decayTime: 0.25,
                    sustainLevel: 0.5,
                    releaseTime: 0.25,
                    lfoType: 'square',
                    lfoRate: 8.0,
                    lfoDepth: 0.2,
                    colorParams: {
                        paletteColor: 'LIGHT_BLUE',
                    },
                },
                polygon: {
                    sides: 4,
                }
            })
        );
    }
    return objects;
};

import p5 from "p5";
import { BaseSynthObject, CircleSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";

/**
 * プリセット: fx01
 * 放射状に広がる円
 */
export const fx01 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 1000;
    for (let i = 0; i < n; i++) {
        const s = Math.min(p.height, p.width) * map(UniformRandom.rand(i, startTime), 0, 1, 0.005, 0.02);
        const x = p.width * map(UniformRandom.rand(i * 752890, startTime), 0, 1, -0.2, 1.2);
        const y = p.height * map(UniformRandom.rand(i * 189456, startTime), 0, 1, -0.2, 1.2);
        const c = UniformRandom.rand(i * 894792, startTime) < 0.5 ? 'LIGHT_BLUE' : 'RED' as const;

        objects.push(
            new CircleSynthObject({
                startTime,
                bpm,
                x: x,
                y: y,
                size: s,
                angle: 0,
                params: {
                    attackTime: 0.05,
                    decayTime: 0.25,
                    sustainLevel: 0.25,
                    releaseTime: 1.0,
                    lfoType: 'sine',
                    lfoRate: 8.0,
                    lfoDepth: 0.25,
                    colorParams: {
                        paletteColor: c,
                    },
                },
                movement: {
                    angle: Math.floor(UniformRandom.rand(i * 894792, startTime) * 16) / 4,
                    distance: p.width * 0.05,
                    angleLFO: true,
                    angleLFORate: 4.0,
                    angleLFODepth: 0.1,
                }
            })
        );
    }
    return objects;
};

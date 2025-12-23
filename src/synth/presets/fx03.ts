import p5 from "p5";
import { BaseSynthObject, RectSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeInSine } from "../../utils/math/easing";

/**
 * プリセット: fx03
 * 放射状に広がる円
 */
export const fx03 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 1000;
    for (let i = 0; i < n; i++) {
        const s = Math.min(p.height, p.width) * map(UniformRandom.rand(i, startTime), 0, 1, 0.001, 0.002);
        const angle = startTime * 10.0 + i * Math.PI * 4 / n;
        const radius = Math.min(p.width, p.height) * 0.5;
        const x = p.width / 2 + radius * Math.sin(angle * map(UniformRandom.rand(startTime, 4292), 0, 1, 0.8, 1.2) + UniformRandom.rand(startTime, 9542) * 2 * Math.PI) * map(UniformRandom.rand(startTime, 123456), 0, 1, 0.8, 1.2);
        const y = p.height / 2 + radius * Math.sin(angle);
        const c = (['PURPLE', 'BROWN'] as const)[Math.floor(UniformRandom.rand(i * 123456, startTime) * 2) % 2];

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
                    decayTime: 1.5,
                    sustainLevel: 0.5,
                    releaseTime: 1.0,
                    lfoType: 'sine',
                    lfoRate: 32.0,
                    lfoDepth: 0.02,
                    colorParams: {
                        paletteColor: c,
                    },
                },
                movement: {
                    angle: UniformRandom.rand(startTime, i * 123456) * Math.PI * 2,
                    distance: Math.max(p.width, p.height) * 0.1,
                    angleLFO: true,
                    angleLFORate: 0.125,
                    angleLFODepth: 1.0,
                    easing: easeInSine,
                },
                rect: {
                    aspectRatio: 200.0,
                    stretchMode: 'horizontal'
                }
            })
        );
    }
    return objects;
};

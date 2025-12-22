import p5 from "p5";
import { BaseSynthObject, CircleSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: percussion03
 * 放射状に広がる円
 */
export const percussion03 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const m = 2;
    const n = 50;
    for (let j = 0; j < m; j++) {
        for (let i = 0; i < n; i++) {
            const x = p.width * ((j + 0.5) / m);
            const y = p.height * ((i + 0.5) / n)
            const s = p.height * 0.5 / n;
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
                        attackTime: 0.5,
                        decayTime: 0.25,
                        sustainLevel: 0.25,
                        releaseTime: 0,
                        lfoType: 'square',
                        lfoRate: 2.0,
                        lfoDepth: 0.25,
                        colorParams: {
                            paletteColor: 'RED',
                        },
                    },
                    movement: {
                        angle: UniformRandom.rand(i * 5278 + j * 1894, startTime * 4572) < 0.5 ? Math.PI : 0,
                        distance: p.width * 0.1,
                        angleLFO: true,
                        angleLFORate: 16.0,
                        angleLFODepth: 0.2,
                    }
                })
            );
        }
    }

    return objects;
};

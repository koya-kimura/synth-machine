import p5 from "p5";
import { BaseSynthObject, CircleSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeInExpo } from "../../utils/math/easing";

/**
 * プリセット: fx02
 * 放射状に広がる円
 */
export const fx02 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 500;
    for (let i = 0; i < n; i++) {
        const s = Math.min(p.height, p.width) * map(UniformRandom.rand(i, startTime), 0, 1, 0.005, 0.02);
        const angle = startTime * 10.0 + i * Math.PI * 2 / n;
        const radius = map(UniformRandom.rand(i * 752890, startTime), 0, 1, 0.8, 1.2) * Math.max(p.width, p.height) * 0.5;
        const x = p.width / 2 + radius * Math.cos(angle);
        const y = p.height / 2 + radius * Math.sin(angle);
        const c = (['RED', 'BLUE', 'GREEN', 'YELLOW'] as const)[Math.floor(UniformRandom.rand(i * 123456, startTime) * 4) % 4];

        objects.push(
            new CircleSynthObject({
                startTime,
                bpm,
                x: x,
                y: y,
                size: s,
                angle: 0,
                params: {
                    attackTime: 5.0,
                    decayTime: 1.0,
                    sustainLevel: 0.8,
                    releaseTime: 4.0,
                    lfoType: 'sine',
                    lfoRate: 16.0,
                    lfoDepth: 0.5,
                    colorParams: {
                        paletteColor: c,
                    },
                },
                movement: {
                    angle: angle + Math.PI,
                    distance: Math.max(p.width, p.height) * Math.sqrt(2),
                    angleLFO: true,
                    angleLFORate: 0.25,
                    angleLFODepth: 0.2,
                    easing: easeInExpo,
                }
            })
        );
    }
    return objects;
};

import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";

/**
 * プリセット: percussion02
 * 放射状に広がる円
 */
export const percussion02 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 5;
    for (let i = 0; i < n; i++) {
        const x = UniformRandom.rand(startTime, i * 58300) * p.width;
        const y = UniformRandom.rand(startTime, i * 47418) * p.height;
        const s = p.width * 0.08;
        const angle = UniformRandom.rand(startTime, i) * Math.PI * 2;
        const attackTime = map(Math.pow(UniformRandom.rand(startTime, i), 2), 0, 1, 0.01, 0.02);
        const decayTime = 0.25 - attackTime;
        const dirAngle = UniformRandom.rand(startTime, i * 8904) * Math.PI * 2;
        const distance = map(UniformRandom.rand(startTime, i * 9876), 0, 1, 0.1, 0.2) * Math.min(p.width, p.height);

        objects.push(
            new PolygonSynthObject({
                startTime,
                bpm,
                x: x,
                y: y,
                size: s,
                angle: angle,
                params: {
                    attackTime: attackTime,
                    decayTime: decayTime,
                    sustainLevel: 0.2,
                    releaseTime: 0.125,
                    lfoType: 'saw',
                    lfoRate: 128.0,
                    lfoDepth: 0.1,
                    colorParams: {
                        paletteColor: 'PURPLE',
                    },
                },
                polygon: {
                    sides: 5,
                    irregularity: 0.5,
                    spikiness: 0.5,
                },
                movement: {
                    angle: dirAngle,
                    distance: distance,
                }
            })
        );
    }
    return objects;
};

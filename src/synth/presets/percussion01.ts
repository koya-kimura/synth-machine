import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";

/**
 * プリセット: percussion01
 * 放射状に広がる円
 */
export const percussion01 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const gx = 10;
    const gy = Math.floor(gx * (p.height / p.width));
    for (let i = 0; i < gx; i++) {
        for (let j = 0; j < gy; j++) {
            const x = p.width * ((i + 0.5) / gx);
            const y = p.height * ((j + 0.5) / gy);
            const s = p.width * 0.02;
            const angle = UniformRandom.rand(startTime, i) * Math.PI * 2;
            const attackTime = map(Math.pow(UniformRandom.rand(startTime, i), 2), 0, 1, 0.01, 0.02);
            const decayTime = 0.25 - attackTime;
            const sides = Math.floor(UniformRandom.rand(startTime, i) * 3 + 3);
            const isShow = UniformRandom.rand(startTime, i * 52790 + j * 47418) > 0.5;

            if (isShow) {
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
                            lfoRate: 64.0,
                            lfoDepth: 0.1,
                            colorParams: {
                                paletteColor: 'PINK',
                            },
                        },
                        polygon: {
                            sides: sides,
                        },
                    })
                );
            }
        }
    }
    return objects;
};

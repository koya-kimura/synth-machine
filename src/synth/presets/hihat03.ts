import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";

/**
 * プリセット: hihat03
 * 放射状に広がる円
 */
export const hihat03 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 10;
    for (let i = 0; i < n; i++) {
        const x = p.width * ((i + 0.5) / n);
        const y = p.height * 0.5;
        const s = p.width * 0.2 / n;
        const angle = UniformRandom.rand(startTime, i) * Math.PI * 2;
        const attackTime = map(Math.pow(UniformRandom.rand(startTime, i), 2), 0, 1, 0.01, 0.2);
        const decayTime = 0.25 - attackTime;

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
                    sides: 3,
                },
            })
        );
    }

    return objects;
};

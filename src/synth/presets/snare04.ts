import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: snare04
 * 放射状に広がる円
 */
export const snare04 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const s = Math.min(p.width, p.height) * map(UniformRandom.rand(startTime), 0, 1, 0.1, 0.3);
    const x = p.width * map(UniformRandom.rand(startTime, 5389), 0, 1, 0, 1);
    const y = p.height * map(UniformRandom.rand(startTime, 9847), 0, 1, 0, 1);
    const angle = map(UniformRandom.rand(startTime, 2345), 0, 1, 0, Math.PI * 2);

    objects.push(
        new PolygonSynthObject({
            startTime,
            bpm,
            x: x,
            y: y,
            size: s,
            angle: angle,
            params: {
                attackTime: 0.0675,
                decayTime: 0.25,
                sustainLevel: 1.0,
                releaseTime: 0,
                colorParams: {
                    paletteColor: 'LIGHT_BLUE',
                },
            },
            polygon: {
                sides: 6,
                irregularity: 0.8,
                spikiness: 0.8,
            }
        })
    );

    return objects;
};

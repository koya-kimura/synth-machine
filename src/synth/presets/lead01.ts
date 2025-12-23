import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";

/**
 * プリセット: lead01
 * 放射状に広がる円
 */
export const lead01 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const angle = UniformRandom.rand(startTime) * Math.PI * 10.0;
    const s = Math.min(p.width, p.height) * 0.35;

    objects.push(
        new PolygonSynthObject({
            startTime,
            bpm,
            x: p.width / 2,
            y: p.height / 2,
            size: s,
            angle: angle,
            params: {
                attackTime: 0.05,
                decayTime: 0.25,
                sustainLevel: 1.0,
                releaseTime: 0.5,
                lfoType: 'sine',
                lfoRate: 10.0,
                lfoDepth: 0.5,
                colorParams: {
                    paletteColor: 'BLUE',
                },
            },
            polygon: {
                sides: 10,
                irregularity: 0.9,
                spikiness: 0.5,
            },
            style: {
                mode: 'stroke',
                strokeWeight: Math.min(p.width, p.height) * 0.03,
            }
        })
    );

    return objects;
};

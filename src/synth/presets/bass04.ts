import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";
import { shuffle } from "../../utils/math/array";

/**
 * プリセット: bass04
 * 放射状に広がる円
 */
export const bass04 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    objects.push(
        new PolygonSynthObject({
            startTime,
            bpm,
            x: p.width / 2,
            y: p.height * 1.5,
            size: p.height * 1.25,
            angle: 0,
            params: {
                attackTime: 0.125,
                decayTime: 1.0,
                sustainLevel: 1.0,
                releaseTime: 0.5,
                lfoType: 'square',
                lfoRate: 32.0,
                lfoDepth: 0,
                colorParams: {
                    paletteColor: 'RED',
                },
            },
            polygon: {
                sides: 32,
                irregularity: 1.0,
                spikiness: 0.3,
                vertexLFO: true,
                vertexLFORate: 0.25,
                vertexLFODepth: 0.5,
            },
            style: {
                mode: 'stroke',
                strokeWeight: Math.min(p.width, p.height) * 0.1,
            }
        })
    );

    return objects;
};

import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: lead05
 * 放射状に広がる円
 */
export const lead05 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const angle = UniformRandom.rand(startTime) * Math.PI * 4.0;
    const x = p.width * 0.5 + Math.cos(angle) * Math.max(p.width, p.height) * 0.5 * Math.sqrt(2) * 1.5;
    const y = p.height * 0.5 + Math.sin(angle) * Math.max(p.width, p.height) * 0.5 * Math.sqrt(2) * 1.5;
    const h = Math.min(p.width, p.height) * 0.4;

    objects.push(
        new PolygonSynthObject({
            startTime,
            bpm,
            x: x,
            y: y,
            size: h,
            angle: 0,
            params: {
                attackTime: 1.0,
                decayTime: 2.0,
                sustainLevel: 1.0,
                releaseTime: 2.0,
                lfoType: 'sine',
                lfoRate: 0.25,
                lfoDepth: 0.5,
                colorParams: {
                    paletteColor: 'BLUE',
                },
            },
            polygon: {
                sides: 8,
                irregularity: 1.0,
                spikiness: 1.0,
                vertexLFO: true,
                vertexLFORate: 0.5,
                vertexLFODepth: 0.1,
            },
            movement: {
                angle: angle + Math.PI,
                distance: Math.max(p.width, p.height) * Math.sqrt(2) * 1.5,
                angleLFO: true,
                angleLFORate: 0.25,
                angleLFODepth: Math.PI * 0.1,
                easing: easeOutQuad,
            }
        })
    );
    return objects;
};

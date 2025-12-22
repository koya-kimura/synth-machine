import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: percussion04
 * 放射状に広がる円
 */
export const percussion04 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 7;
    for (let i = 0; i < n; i++) {
        const angle = startTime * 10.0 + i * Math.PI * 2 / n;
        const x = p.width / 2 + Math.cos(angle) * Math.min(p.width, p.height) * 0.65;
        const y = p.height / 2 + Math.sin(angle) * Math.min(p.width, p.height) * 0.65;
        const s = Math.min(p.width, p.height) * 0.1;

        objects.push(
            new PolygonSynthObject({
                startTime,
                bpm,
                x: x,
                y: y,
                size: s,
                angle: 0,
                params: {
                    attackTime: 0.25,
                    decayTime: 0.5,
                    sustainLevel: 1.0,
                    releaseTime: 0.25,
                    colorParams: {
                        paletteColor: 'YELLOW',
                    },
                },
                polygon: {
                    sides: 10,
                    spikiness: 0.8,
                },
                movement: {
                    angle: angle + Math.PI,
                    distance: Math.min(p.width, p.height) * 0.2,
                    angleLFO: true,
                    angleLFORate: 0.25,
                    angleLFODepth: 1.0,
                }
            })
        );
    }

    return objects;
};

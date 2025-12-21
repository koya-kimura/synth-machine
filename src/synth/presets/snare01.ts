import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: snare01
 * 放射状に広がる円
 */
export const snare01 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 5;
    for (let i = 0; i < n; i++) {
        const angle = startTime * 0.1 + i * Math.PI * 2 / n;
        const startRadius = Math.min(p.width, p.height) * 0.3;
        const l = Math.min(p.width, p.height) * 0.3;
        const x = p.width / 2 + Math.cos(angle) * startRadius;
        const y = p.height / 2 + Math.sin(angle) * startRadius;
        const s = Math.min(p.width, p.height) * 0.1;
        const angle2 = map(UniformRandom.rand(i, startTime), 0, 1, 0, Math.PI * 2);

        objects.push(
            new PolygonSynthObject({
                startTime,
                bpm,
                x: x,
                y: y,
                size: s,
                angle: angle2,
                params: {
                    attackTime: 0.02,
                    decayTime: 0.25,
                    sustainLevel: 1.0,
                    releaseTime: 0.0,
                    lfoType: 'square',
                    lfoRate: 8.0,
                    lfoDepth: 0.1,
                    colorParams: {
                        paletteColor: 'GREEN',
                    },
                },
                polygon: { sides: 3 },
                movement: {
                    angle: angle,  // 各円が外側に広がる（ラジアン）
                    distance: l,
                    easing: easeOutQuad,
                }
            })
        );
    }
    return objects;
};

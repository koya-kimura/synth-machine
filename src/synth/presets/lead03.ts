import p5 from "p5";
import { BaseSynthObject, RectSynthObject, CircleSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { map } from "../../utils/math/mathUtils";
import { easeOutQuad } from "../../utils/math/easing";
import { shuffle } from "../../utils/math/array";

/**
 * プリセット: lead03
 * 放射状に広がる円
 */
export const lead03 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 5;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const l = Math.min(p.width, p.height) * 0.8;
            const x = p.width / 2 + l * ((i + 0.5) / n) - l / 2;
            const y = p.height / 2 + l * ((j + 0.5) / n) - l / 2;
            const s = l / n * 0.5;
            const isShow = UniformRandom.rand(i * 894792 + j * 974298, startTime) < 0.2;
            const attackTime = map(UniformRandom.rand(i * 894792 + j * 123456789, startTime), 0, 1, 0.125, 0.5);
            const decayTime = 0.75 - attackTime;

            objects.push(
                new RectSynthObject({
                    startTime,
                    bpm,
                    x: x,
                    y: y,
                    size: s,
                    angle: 0,
                    params: {
                        attackTime: 0,
                        decayTime: 1.0,
                        sustainLevel: 1.0,
                        releaseTime: 0.5,
                        lfoType: 'square',
                        lfoRate: 32.0,
                        lfoDepth: 0,
                        colorParams: {
                            paletteColor: 'BROWN',
                        },
                    },
                    style: {
                        mode: 'stroke',
                        strokeWeight: Math.min(p.width, p.height) * 0.005,
                    }
                })
            );

            if (isShow) {
                objects.push(
                    new CircleSynthObject({
                        startTime,
                        bpm,
                        x: x,
                        y: y,
                        size: s * 0.35,
                        angle: 0,
                        params: {
                            attackTime: attackTime,
                            decayTime: decayTime,
                            sustainLevel: 0.5,
                            releaseTime: 0.25,
                            lfoType: 'square',
                            lfoRate: 32.0,
                            lfoDepth: 0.1,
                            colorParams: {
                                paletteColor: 'RED',
                            },
                        },
                    })
                );
            }
        }
    }

    return objects;
};

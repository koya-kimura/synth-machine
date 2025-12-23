import p5 from "p5";
import { BaseSynthObject, RectSynthObject } from "../object";
import { UniformRandom } from "../../utils/math/uniformRandom";
import { shuffle } from "../../utils/math/array";

/**
 * プリセット: snare05
 * 放射状に広がる円
 */
export const snare05 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 8;
    const arr = shuffle([...Array(n).keys()]);
    for (let i of arr) {
        const x = p.width * ((i + 0.5) / n);
        const y = p.height * 0.5
        const h = p.height * 1.2;
        const isShow = UniformRandom.rand(i * 894792, startTime) < 0.2;

        if (isShow || objects.length == 0) {
            objects.push(
                new RectSynthObject({
                    startTime,
                    bpm,
                    x: x,
                    y: y,
                    size: h,
                    angle: 0,
                    params: {
                        attackTime: 0.00125,
                        decayTime: 0.5,
                        sustainLevel: 1.0,
                        releaseTime: 0.125,
                        lfoType: 'square',
                        lfoRate: 32.0,
                        lfoDepth: 0.0675,
                        colorParams: {
                            paletteColor: 'ORANGE',
                        },
                    },
                    rect: {
                        aspectRatio: p.width / n / h,
                        stretchMode: 'vertical',
                    },
                })
            );
        }
    }

    return objects;
};

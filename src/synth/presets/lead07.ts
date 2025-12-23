import p5 from "p5";
import { BaseSynthObject, RectSynthObject } from "../object";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: lead07
 * 放射状に広がる円
 */
export const lead07 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const n = 8;
    for (let i = 0; i < n; i++) {
        const angle = i * Math.PI * 2 / n;
        const x = p.width * 0.5;
        const y = p.height * 0.5;
        const s = Math.min(p.width, p.height) * 0.1;

        objects.push(
            new RectSynthObject({
                startTime,
                bpm,
                x: x,
                y: y,
                size: s,
                angle: angle,
                params: {
                    attackTime: 0.5,
                    decayTime: 0.25,
                    sustainLevel: 1.0,
                    releaseTime: 0.5,
                    lfoType: 'sine',
                    lfoRate: 2.0,
                    lfoDepth: 0.125,
                    colorParams: {
                        paletteColor: 'DARK_BLUE',
                    },
                },
                rect: {
                    stretchMode: 'horizontal',
                    aspectRatio: Math.min(p.width, p.height) * 0.8 / s,
                },
                movement: {
                    angle: angle + Math.PI,
                    distance: Math.min(p.width, p.height) * 0.125,
                    angleLFO: true,
                    angleLFORate: 0.125,
                    angleLFODepth: Math.PI * 0.5,
                    easing: easeOutQuad,
                }
            })
        );
    }

    return objects;
};

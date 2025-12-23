import p5 from "p5";
import { BaseSynthObject, RectSynthObject } from "../object";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット: bass01
 * 放射状に広がる円
 */
export const bass01 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const x = p.width * 0.5;
    const y = p.height;
    const h = p.height * 0.1;

    objects.push(
        new RectSynthObject({
            startTime,
            bpm,
            x: x,
            y: y,
            size: h,
            angle: 0,
            params: {
                attackTime: 0.125,
                decayTime: 0.5,
                sustainLevel: 1.0,
                releaseTime: 0.125,
                lfoType: 'sine',
                lfoRate: 0.5,
                lfoDepth: 1.5,
                colorParams: {
                    paletteColor: 'BLUE',
                },
            },
            movement: {
                angle: -Math.PI * 0.5,
                distance: p.height,
                easing: easeOutQuad,
            },
            rect: {
                stretchMode: 'vertical',
                aspectRatio: p.width / h,
            }
        })
    );
    return objects;
};

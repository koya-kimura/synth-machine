import p5 from "p5";
import { BaseSynthObject, RectSynthObject } from "../object";

/**
 * プリセット: bass03
 * 放射状に広がる円
 */
export const bass03 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    const x = p.width * 0.5;
    const y = p.height * 0.5;
    const h = p.height;

    objects.push(
        new RectSynthObject({
            startTime,
            bpm,
            x: x,
            y: y,
            size: h,
            angle: 0,
            params: {
                attackTime: 0,
                decayTime: 0.5,
                sustainLevel: 1.0,
                releaseTime: 0,
                lfoType: 'square',
                lfoRate: 20.0,
                lfoDepth: 0.1,
                colorParams: {
                    paletteColor: 'PURPLE',
                },
            },
            style: {
                mode: 'stroke',
                strokeWeight: Math.min(p.width, p.height) * 0.2
            },
            rect: {
                stretchMode: 'uniform',
                aspectRatio: p.width / p.height,
            }
        })
    );
    return objects;
};

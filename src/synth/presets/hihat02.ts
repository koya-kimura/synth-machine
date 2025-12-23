import p5 from "p5";
import { BaseSynthObject, RectSynthObject } from "../object";

/**
 * プリセット: hihat02
 * 放射状に広がる円
 */
export const hihat02 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    let objects: BaseSynthObject[] = [];

    objects.push(
        new RectSynthObject({
            startTime,
            bpm,
            x: p.width,
            y: p.height * 0.5,
            size: p.height,
            angle: 0,
            params: {
                attackTime: 0.01,
                decayTime: 0.125,
                sustainLevel: 0.2,
                releaseTime: 0.25,
                lfoType: 'sine',
                lfoRate: 64.0,
                lfoDepth: 10.0,
                colorParams: {
                    paletteColor: 'ORANGE',
                },
            },
            rect: {
                aspectRatio: 0.01,
                stretchMode: 'horizontal'
            },
            movement: {
                angle: Math.PI,
                distance: p.width,
            }
        })
    );

    return objects;
};

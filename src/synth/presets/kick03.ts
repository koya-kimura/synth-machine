import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";

/**
 * プリセット: kick03
 * 多角形のキックビジュアル
 */
export const kick03 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    return [
        new PolygonSynthObject({
            startTime,
            bpm,
            x: p.width / 2,
            y: p.height / 2,
            size: Math.min(p.width, p.height) * 0.3,
            angle: 0,
            params: {
                attackTime: 0.02,
                decayTime: 0.5,
                sustainLevel: 0.8,
                releaseTime: 0.0,
                lfoType: 'square',
                lfoRate: 8.0,
                lfoDepth: 0.1,
                colorParams: {
                    paletteColor: 'YELLOW',
                },
            },
            polygon: { sides: 4 },
        })
    ];
};

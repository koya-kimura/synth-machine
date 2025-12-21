import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject } from "../object";

/**
 * プリセット: kick02
 * 多角形のキックビジュアル
 */
export const kick02 = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    return [
        new PolygonSynthObject({
            startTime,
            bpm,
            x: p.width / 2,
            y: p.height / 2,
            size: Math.min(p.width, p.height) * 0.4,
            angle: 0,
            params: {
                attackTime: 0.05,
                decayTime: 0.25,
                sustainLevel: 0.95,
                releaseTime: 1.0,
                lfoType: 'sine',
                lfoRate: 0.5,
                lfoDepth: 0.5,
                colorParams: {
                    paletteColor: 'BLUE',
                },
            },
            polygon: { sides: 10 },
        })
    ];
};

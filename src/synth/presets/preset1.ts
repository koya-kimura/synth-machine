import p5 from "p5";
import { BaseSynthObject, CircleSynthObject, type MovementParams } from "../object";
import { easeOutQuad } from "../../utils/math/easing";

/**
 * プリセット1: 下から上に移動する円
 * 水色系の円が画面下から上へ移動
 */
export const createThreeCirclesPreset = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    const objects: BaseSynthObject[] = [];

    // 移動パラメータ：下から上へ
    const movementParams: MovementParams = {
        angle: 270,             // 上方向（270度）
        distance: p.height,     // 画面の高さ分移動
        angleLFO: false,
        angleLFORate: 0,
        angleLFODepth: 0,
        easing: easeOutQuad,    // 減速しながら到着
    };

    objects.push(new CircleSynthObject(
        p.width / 2,      // 画面中央X
        p.height - 50,    // 画面下部から開始（半径分上）
        startTime,
        bpm,
        {
            attackTime: 0.5,
            decayTime: 0.0,
            sustainLevel: 1.0,
            releaseTime: 0.5,
            noteDuration: 3.0,  // 3拍かけて移動
            waveform: 'sine',
            lfoRate: 2,
            lfoDepth: 10,
            colorParams: {
                hue: 180,
                saturation: 80,
                brightness: 100,
            },
        },
        50,
        movementParams
    ));

    return objects;
};

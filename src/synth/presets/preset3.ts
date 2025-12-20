import p5 from "p5";
import { BaseSynthObject, CircleSynthObject, type EllipseParams } from "../object";
import type { SynthParams } from "../synthTypes";

/**
 * プリセット3: カラーパレットを使った楕円
 * 横長の楕円がカラーパレットのCYANで描画される
 */
export const createGridCirclesPreset = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    const objects: BaseSynthObject[] = [];

    // シンセパラメータ（カラーパレット使用）
    const synthParams: SynthParams = {
        attackTime: 0.5,
        decayTime: 0.2,
        sustainLevel: 0.8,
        releaseTime: 1.0,
        noteDuration: 2.5,
        waveform: 'sine',
        lfoRate: 1.5,
        lfoDepth: 15,
        colorParams: {
            hue: 0,           // パレット使用時は無視
            saturation: 0,
            brightness: 0,
            paletteColor: 'PURPLE',  // 紫色
        },
    };

    // 楕円パラメータ（横長）
    const ellipseParams: EllipseParams = {
        aspectRatio: 2.5,  // 幅が高さの2.5倍
    };

    objects.push(new CircleSynthObject(
        p.width / 2,
        p.height / 2,
        startTime,
        bpm,
        synthParams,
        60,              // 基本サイズ
        undefined,       // movementParams（使用しない）
        ellipseParams
    ));

    return objects;
};

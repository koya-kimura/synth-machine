import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject, type PolygonParams } from "../object";
import type { SynthParams } from "../synthTypes";

/**
 * プリセット3: 頂点が揺れる六角形
 * 不規則な六角形で各頂点が独立してLFOで揺れる
 */
export const createGridCirclesPreset = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    const objects: BaseSynthObject[] = [];

    // シンセパラメータ
    const synthParams: SynthParams = {
        attackTime: 0.3,
        decayTime: 0.1,
        sustainLevel: 0.9,
        releaseTime: 0.8,
        noteDuration: 3.0,
        waveform: 'sine',
        lfoRate: 1,
        lfoDepth: 10,
        colorParams: {
            hue: 120,       // 緑
            saturation: 70,
            brightness: 90,
        },
    };

    // 多角形パラメータ（六角形、少し不規則、頂点LFO有効）
    const polygonParams: PolygonParams = {
        sides: 6,
        baseRadius: 80,
        irregularity: 0.15,      // 少し不規則
        spikiness: 0,            // 窪みなし
        vertexLFO: true,         // 頂点ごとのLFO有効
        vertexLFORate: 0.8,
        vertexLFODepth: 15,
    };

    objects.push(new PolygonSynthObject(
        p.width / 2,
        p.height / 2,
        startTime,
        bpm,
        synthParams,
        polygonParams
    ));

    return objects;
};

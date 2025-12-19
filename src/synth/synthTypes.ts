/**
 * Waveform types for SynthObject
 */
export type Waveform = 'sine' | 'saw' | 'square' | 'noise';

/**
 * ADSR envelope phases (ADSRエンベロープのフェーズ)
 */
export type ADSRPhase =
    | 'ATTACK'    // アタック: 音が立ち上がる
    | 'DECAY'     // ディケイ: 最大音量から減衰
    | 'SUSTAIN'   // サスティン: 持続
    | 'RELEASE'   // リリース: 音が消える
    | 'DEAD';     // 終了: オブジェクト削除対象

/**
 * Color parameters for SynthObject
 */
export interface ColorParams {
    hue: number;        // 0-360
    saturation: number; // 0-100
    brightness: number; // 0-100
}

/**
 * Synth parameters (time values are in beats)
 */
export interface SynthParams {
    attackTime: number;    // Attack time in beats
    decayTime: number;     // Decay time in beats
    sustainLevel: number;  // Sustain level (0.0-1.0)
    releaseTime: number;   // Release time in beats
    noteDuration: number;  // Note duration in beats (when to start release)
    waveform: Waveform;    // Waveform type
    lfoRate: number;       // LFO rate in Hz
    lfoDepth: number;      // LFO depth in pixels
    colorParams: ColorParams; // Color parameters
}

/**
 * Convert beats to milliseconds based on BPM
 * @param beats Number of beats
 * @param bpm Beats per minute
 * @returns Time in milliseconds
 */
export function beatsToMs(beats: number, bpm: number): number {
    return (beats * 60000) / bpm;
}

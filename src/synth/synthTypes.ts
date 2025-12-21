/**
 * Waveform types for SynthObject
 */
export type Waveform = 'sine' | 'saw' | 'square' | 'noise';

/**
 * LFO waveform types
 */
export type LfoType = 'sine' | 'saw' | 'square' | 'triangle' | 'noise';

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
 * 全てオプショナル。paletteColorを指定するとHSB値より優先
 */
export interface ColorParams {
    /** 色相（0-360、デフォルト: 0） */
    hue?: number;
    /** 彩度（0-100、デフォルト: 0） */
    saturation?: number;
    /** 明度（0-100、デフォルト: 100） */
    brightness?: number;
    /** パレット色（指定するとHSB値より優先） */
    paletteColor?: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'CYAN' | 'BLUE' | 'PURPLE' | 'PINK';
}

/**
 * Synth parameters (time values are in beats)
 * 全てオプショナル。デフォルト値が適用されます
 */
export interface SynthParams {
    /** Attack time in beats（デフォルト: 0.1） */
    attackTime?: number;
    /** Decay time in beats（デフォルト: 0） */
    decayTime?: number;
    /** Sustain level 0.0-1.0（デフォルト: 1.0） */
    sustainLevel?: number;
    /** Release time in beats（デフォルト: 0.1） */
    releaseTime?: number;
    /** Note duration in beats（デフォルト: 1.0） */
    noteDuration?: number;
    /** Waveform type（デフォルト: 'sine'） */
    waveform?: Waveform;
    /** LFO waveform type（デフォルト: 'sine'） */
    lfoType?: LfoType;
    /** LFO rate in Hz（デフォルト: 0） */
    lfoRate?: number;
    /** LFO depth in pixels（デフォルト: 0） */
    lfoDepth?: number;
    /** Color parameters */
    colorParams?: ColorParams;
}

/**
 * 内部で使用する解決済みのSynthParams（全て必須）
 */
export interface ResolvedSynthParams {
    attackTime: number;
    decayTime: number;
    sustainLevel: number;
    releaseTime: number;
    noteDuration: number;
    waveform: Waveform;
    lfoType: LfoType;
    lfoRate: number;
    lfoDepth: number;
    colorParams: {
        hue: number;
        saturation: number;
        brightness: number;
        paletteColor?: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'CYAN' | 'BLUE' | 'PURPLE' | 'PINK';
    };
}

/**
 * SynthParamsにデフォルト値を適用
 */
export function resolveSynthParams(params: SynthParams = {}): ResolvedSynthParams {
    return {
        attackTime: params.attackTime ?? 0.1,
        decayTime: params.decayTime ?? 0,
        sustainLevel: params.sustainLevel ?? 1.0,
        releaseTime: params.releaseTime ?? 0.1,
        noteDuration: params.noteDuration ?? 1.0,
        waveform: params.waveform ?? 'sine',
        lfoType: params.lfoType ?? 'sine',
        lfoRate: params.lfoRate ?? 0,
        lfoDepth: params.lfoDepth ?? 0,
        colorParams: {
            hue: params.colorParams?.hue ?? 0,
            saturation: params.colorParams?.saturation ?? 0,
            brightness: params.colorParams?.brightness ?? 100,
            paletteColor: params.colorParams?.paletteColor,
        },
    };
}

/**
 * イージング関数の型
 * 0〜1の入力を受け取り、0〜1の出力を返す
 */
export type EasingFunction = (x: number) => number;

/**
 * Movement parameters for SynthObject
 * オブジェクトの移動を制御するパラメータ
 */
export interface MovementParams {
    /** 移動角度（度、0=右、90=下、180=左、270=上） */
    angle: number;
    /** 移動距離（ピクセル） */
    distance: number;
    /** 角度LFOを有効化（デフォルト: false） */
    angleLFO?: boolean;
    /** 角度LFOレート（Hz、デフォルト: 0） */
    angleLFORate?: number;
    /** 角度LFO深度（度、デフォルト: 0） */
    angleLFODepth?: number;
    /** イージング関数（デフォルト: linear） */
    easing?: EasingFunction;
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

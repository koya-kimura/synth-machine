import type p5 from "p5";
import type { ADSRPhase, MovementParams, EasingFunction, ResolvedSynthParams, SynthObjectConfig } from "./synthTypes";
import { beatsToMs, resolveSynthParams } from "./synthTypes";
import { linear } from "../utils/math/easing";
import { getSynthColorHSB, type SynthColorKey } from "../utils/color/colorPalette";

/**
 * BaseSynthObject - シンセサイザービジュアルオブジェクトの基底クラス
 * 
 * ADSRエンベロープ、LFO、ライフサイクル管理、移動など、
 * 全ての図形タイプで共通する機能を提供します。
 * 
 * 具体的な描画は派生クラスで実装します。
 */
export abstract class BaseSynthObject {
    // ========================================
    // プロテクテッドプロパティ（派生クラスからアクセス可能）
    // ========================================

    /** 描画位置: X座標（現在の位置） */
    protected x: number;

    /** 描画位置: Y座標（現在の位置） */
    protected y: number;

    /** 開始位置: X座標 */
    protected startX: number;

    /** 開始位置: Y座標 */
    protected startY: number;

    /** オブジェクト生成時刻（ミリ秒） */
    protected startTime: number;

    /** BPM（Beats Per Minute） */
    protected bpm: number;

    /** シンセサイザーパラメータ（解決済み） */
    protected params: ResolvedSynthParams;

    /** 現在のADSRフェーズ */
    protected currentPhase: ADSRPhase;

    /** 現在のエンベロープレベル（0.0～1.0） */
    protected currentLevel: number;

    /** 基本サイズ（ピクセル） */
    protected baseSize: number;

    /** 回転角度（度） */
    protected rotationAngle: number;

    /** ランダムシード（インスタンス固有） */
    protected randomSeed: number;

    // ビート→ミリ秒変換済みのタイムパラメータ
    /** アタック時間（ミリ秒） */
    protected attackMs: number;

    /** ディケイ時間（ミリ秒） */
    protected decayMs: number;

    /** リリース時間（ミリ秒） */
    protected releaseMs: number;

    // 移動パラメータ
    /** 移動パラメータ（オプショナル） */
    protected movementParams: MovementParams | undefined;

    /** 全生存時間（Attack開始〜Release終了、ミリ秒） */
    protected totalLifetimeMs: number;

    /** イージング関数 */
    protected easingFunction: EasingFunction;

    /** スタイルパラメータ */
    protected styleMode: 'fill' | 'stroke';
    protected strokeWeight: number;

    /** プリセットインデックス（描画順制御用） */
    public presetIndex: number;

    // ========================================
    // コンストラクタ
    // ========================================

    /**
     * BaseSynthObjectを生成
     * 
     * @param config - オブジェクト設定
     */
    constructor(config: SynthObjectConfig) {
        // パラメータにデフォルト値を適用
        this.params = resolveSynthParams(config.params);

        this.x = config.x;
        this.y = config.y;
        this.startX = config.x;
        this.startY = config.y;
        this.startTime = config.startTime;
        this.bpm = config.bpm;
        this.baseSize = config.size ?? 50;
        this.rotationAngle = config.angle ?? 0;
        this.currentPhase = 'ATTACK';
        this.currentLevel = 0;
        this.movementParams = config.movement;

        // インスタンス固有のランダムシードを生成
        this.randomSeed = Math.random() * 10000;

        // ビート単位の時間をミリ秒に変換
        this.attackMs = beatsToMs(this.params.attackTime, config.bpm);
        this.decayMs = beatsToMs(this.params.decayTime, config.bpm);
        this.releaseMs = beatsToMs(this.params.releaseTime, config.bpm);

        // 全生存時間を計算（Attack + Decay + Release）
        this.totalLifetimeMs = this.attackMs + this.decayMs + this.releaseMs;

        // イージング関数を設定（デフォルト: linear）
        this.easingFunction = config.movement?.easing ?? linear;

        // スタイルパラメータを設定
        this.styleMode = config.style?.mode ?? 'fill';
        this.strokeWeight = config.style?.strokeWeight ?? 1;

        // プリセットインデックスを設定
        this.presetIndex = config.presetIndex ?? 0;
    }

    // ========================================
    // パブリックメソッド
    // ========================================

    /**
     * オブジェクトの状態を更新
     * 
     * @param p - p5インスタンス
     */
    update(p: p5): void {
        const elapsed = p.millis() - this.startTime;
        this.updateADSREnvelope(elapsed);
        this.updatePosition(elapsed);
    }

    /**
     * オブジェクトを描画（派生クラスで実装）
     * 
     * @param p - p5インスタンス
     * @param tex - 描画先のGraphicsオブジェクト
     */
    abstract display(p: p5, tex: p5.Graphics): void;

    /**
     * オブジェクトが消滅したかどうかを判定
     * 
     * @returns DEADフェーズに達した場合true
     */
    isDead(): boolean {
        return this.currentPhase === 'DEAD';
    }

    // ========================================
    // プロテクテッドメソッド: ADSR計算
    // ========================================

    /**
     * ADSRエンベロープを更新
     * 
     * @param elapsed - 生成からの経過時間（ミリ秒）
     */
    protected updateADSREnvelope(elapsed: number): void {
        switch (this.currentPhase) {
            case 'ATTACK':
                this.processAttackPhase(elapsed);
                break;
            case 'DECAY':
                this.processDecayPhase(elapsed);
                break;
            case 'SUSTAIN':
                this.processSustainPhase(elapsed);
                break;
            case 'RELEASE':
                this.processReleasePhase(elapsed);
                break;
            case 'DEAD':
                break;
        }
    }

    /**
     * Attackフェーズの処理
     */
    protected processAttackPhase(elapsed: number): void {
        if (elapsed < this.attackMs) {
            this.currentLevel = elapsed / this.attackMs;
        } else {
            this.currentLevel = 1;
            this.currentPhase = 'DECAY';
        }
    }

    /**
     * Decayフェーズの処理
     */
    protected processDecayPhase(elapsed: number): void {
        const decayElapsed = elapsed - this.attackMs;
        if (decayElapsed < this.decayMs) {
            const decayProgress = decayElapsed / this.decayMs;
            this.currentLevel = 1 - (1 - this.params.sustainLevel) * decayProgress;
        } else {
            this.currentLevel = this.params.sustainLevel;
            this.currentPhase = 'SUSTAIN';
        }
    }

    /**
     * Sustainフェーズの処理
     * Sustainは attack + decay の後に来る
     */
    protected processSustainPhase(elapsed: number): void {
        const sustainStart = this.attackMs + this.decayMs;
        if (elapsed < sustainStart) {
            this.currentLevel = this.params.sustainLevel;
        } else {
            this.currentPhase = 'RELEASE';
        }
    }

    /**
     * Releaseフェーズの処理
     */
    protected processReleasePhase(elapsed: number): void {
        const releaseStart = this.attackMs + this.decayMs;
        const releaseElapsed = elapsed - releaseStart;
        if (releaseElapsed < this.releaseMs) {
            const releaseProgress = releaseElapsed / this.releaseMs;
            this.currentLevel = this.params.sustainLevel * (1 - releaseProgress);
        } else {
            this.currentLevel = 0;
            this.currentPhase = 'DEAD';
        }
    }

    // ========================================
    // プロテクテッドメソッド: 移動計算
    // ========================================

    /**
     * 位置を更新
     * 
     * @param elapsed - 生成からの経過時間（ミリ秒）
     */
    protected updatePosition(elapsed: number): void {
        if (!this.movementParams) {
            return; // 移動パラメータがなければ何もしない
        }

        // 進行度を計算（0〜1）
        const rawProgress = Math.min(1, elapsed / this.totalLifetimeMs);
        const progress = this.easingFunction(rawProgress);

        // 現在の移動距離
        const currentDistance = this.movementParams.distance * progress;

        // 角度を計算（度→ラジアン）
        let angle = this.movementParams.angle;

        // 角度LFOを適用（BPM同期）
        if (this.movementParams.angleLFO) {
            const time = elapsed / 1000; // 秒単位
            const beatsPerSecond = this.bpm / 60;
            const angleLFORate = this.movementParams.angleLFORate ?? 0;
            const angleLFODepth = this.movementParams.angleLFODepth ?? 0;
            const phase = time * beatsPerSecond * angleLFORate;
            const angleLFOValue = Math.sin(phase * Math.PI * 2) * angleLFODepth;
            angle += angleLFOValue;
        }

        // 新しい位置を計算（angleはラジアン）
        this.x = this.startX + Math.cos(angle) * currentDistance;
        this.y = this.startY + Math.sin(angle) * currentDistance;
    }

    // ========================================
    // プロテクテッドメソッド: LFO計算
    // ========================================

    /**
     * LFO波形の値を計算（-1〜1）
     * 
     * @param phase - 位相（0〜1）
     * @returns 波形の値（-1〜1）
     */
    private calculateLfoWaveform(phase: number): number {
        const normalizedPhase = phase % 1;

        switch (this.params.lfoType) {
            case 'sine':
                return Math.sin(normalizedPhase * Math.PI * 2);
            case 'triangle':
                // 0→1→0→-1→0 の三角波
                const t = normalizedPhase * 4;
                if (t < 1) return t;
                if (t < 3) return 2 - t;
                return t - 4;
            case 'saw':
                // 0→1→0 の鋸波（上昇）
                return normalizedPhase * 2 - 1;
            case 'square':
                // 0.5未満で1、0.5以上で-1
                return normalizedPhase < 0.5 ? 1 : -1;
            case 'noise':
                // ランダム（シード付きで一貫性を持たせる）
                return (Math.sin(normalizedPhase * 12345.6789 + this.randomSeed) * 43758.5453) % 2 - 1;
            default:
                return Math.sin(normalizedPhase * Math.PI * 2);
        }
    }

    /**
     * LFO（Low Frequency Oscillator）の値を計算
     * 
     * lfoRate: 1拍あたりの周期数（1=1拍で1周期、2=1拍で2周期）
     * lfoDepth: baseSizeに対する割合（1.0=baseSize分の振幅）
     * 
     * @param p - p5インスタンス
     * @returns LFOによる変調値（ピクセル）
     */
    protected calculateLFO(p: p5): number {
        // lfoRateかlfoDepthが0なら適用しない
        if (this.params.lfoRate === 0 || this.params.lfoDepth === 0) {
            return 0;
        }

        const time = (p.millis() - this.startTime) / 1000;
        // BPM同期: 1拍 = 60/bpm秒、1拍でlfoRate周期
        const beatsPerSecond = this.bpm / 60;
        const phase = time * beatsPerSecond * this.params.lfoRate;

        // lfoDepthはbaseSizeに対する割合
        const amplitude = this.baseSize * this.params.lfoDepth;
        return this.calculateLfoWaveform(phase) * amplitude;
    }

    /**
     * オフセット付きLFOの値を計算（各頂点で異なる位相用）
     * 
     * @param p - p5インスタンス
     * @param phaseOffset - 位相オフセット（0～1）
     * @returns LFOによる変調値（ピクセル）
     */
    protected calculateLFOWithOffset(p: p5, phaseOffset: number): number {
        // lfoRateかlfoDepthが0なら適用しない
        if (this.params.lfoRate === 0 || this.params.lfoDepth === 0) {
            return 0;
        }

        const time = (p.millis() - this.startTime) / 1000;
        // BPM同期: 1拍 = 60/bpm秒、1拍でlfoRate周期
        const beatsPerSecond = this.bpm / 60;
        const phase = time * beatsPerSecond * this.params.lfoRate + phaseOffset;

        // lfoDepthはbaseSizeに対する割合
        const amplitude = this.baseSize * this.params.lfoDepth;
        return this.calculateLfoWaveform(phase) * amplitude;
    }

    /**
     * 均一サイズを計算（ADSR + LFO適用済み）
     * 
     * @param p - p5インスタンス
     * @returns 現在のサイズ（ピクセル）
     */
    protected calculateUniformSize(p: p5): number {
        const lfoValue = this.calculateLFO(p);
        return this.baseSize * this.currentLevel + lfoValue;
    }

    // ========================================
    // プロテクテッドメソッド: 描画ヘルパー
    // ========================================

    /**
     * 描画の準備（HSBモード設定、透明度計算）
     * 
     * @param p - p5インスタンス
     * @param tex - 描画先のGraphicsオブジェクト
     */
    protected setupDrawing(p: p5, tex: p5.Graphics): void {
        tex.push();
        tex.colorMode(p.HSB);

        const alpha = this.currentLevel * 255;

        // パレット色が指定されていれば優先
        let hue: number;
        let saturation: number;
        let brightness: number;

        if (this.params.colorParams.paletteColor) {
            const hsb = getSynthColorHSB(this.params.colorParams.paletteColor as SynthColorKey);
            hue = hsb.hue;
            saturation = hsb.saturation;
            brightness = hsb.brightness;
        } else {
            hue = this.params.colorParams.hue;
            saturation = this.params.colorParams.saturation;
            brightness = this.params.colorParams.brightness;
        }

        // スタイルに応じてfillまたはstrokeを設定
        if (this.styleMode === 'stroke') {
            tex.noFill();
            tex.stroke(hue, saturation, brightness, alpha);
            tex.strokeWeight(this.strokeWeight);
            tex.strokeCap(p.SQUARE);
            tex.strokeJoin(p.MITER);
        } else {
            tex.fill(hue, saturation, brightness, alpha);
            tex.noStroke();
        }
    }

    /**
     * 描画の終了（pop）
     * 
     * @param tex - 描画先のGraphicsオブジェクト
     */
    protected finishDrawing(tex: p5.Graphics): void {
        tex.pop();
    }

    // ========================================
    // ゲッターメソッド: UI表示用
    // ========================================

    get attack(): number {
        return this.params.attackTime;
    }

    get decay(): number {
        return this.params.decayTime;
    }

    get sustain(): number {
        return this.params.sustainLevel;
    }

    get release(): number {
        return this.params.releaseTime;
    }

    get frequency(): number {
        return 440; // プレースホルダー
    }

    get amplitude(): number {
        return this.currentLevel;
    }
}

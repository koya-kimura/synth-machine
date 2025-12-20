import p5 from "p5";
import type { SynthParams, ADSRPhase, MovementParams, EasingFunction } from "./synthTypes";
import { beatsToMs } from "./synthTypes";
import { linear } from "../utils/math/easing";

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

    /** シンセサイザーパラメータ */
    protected params: SynthParams;

    /** 現在のADSRフェーズ */
    protected currentPhase: ADSRPhase;

    /** 現在のエンベロープレベル（0.0～1.0） */
    protected currentLevel: number;

    /** 基本サイズ（ピクセル） */
    protected baseSize: number;

    /** ランダムシード（インスタンス固有） */
    protected randomSeed: number;

    // ビート→ミリ秒変換済みのタイムパラメータ
    /** アタック時間（ミリ秒） */
    protected attackMs: number;

    /** ディケイ時間（ミリ秒） */
    protected decayMs: number;

    /** リリース時間（ミリ秒） */
    protected releaseMs: number;

    /** ノート継続時間（ミリ秒） */
    protected noteDurationMs: number;

    // 移動パラメータ
    /** 移動パラメータ（オプショナル） */
    protected movementParams: MovementParams | undefined;

    /** 全生存時間（Attack開始〜Release終了、ミリ秒） */
    protected totalLifetimeMs: number;

    /** イージング関数 */
    protected easingFunction: EasingFunction;

    // ========================================
    // コンストラクタ
    // ========================================

    /**
     * BaseSynthObjectを生成
     * 
     * @param x - X座標
     * @param y - Y座標
     * @param startTime - 生成時刻（p.millis()の値）
     * @param bpm - BPM
     * @param params - シンセサイザーパラメータ
     * @param baseSize - 基本サイズ（デフォルト: 50）
     * @param movementParams - 移動パラメータ（オプショナル）
     */
    constructor(
        x: number,
        y: number,
        startTime: number,
        bpm: number,
        params: SynthParams,
        baseSize: number = 50,
        movementParams?: MovementParams
    ) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.startTime = startTime;
        this.bpm = bpm;
        this.params = params;
        this.baseSize = baseSize;
        this.currentPhase = 'ATTACK';
        this.currentLevel = 0;
        this.movementParams = movementParams;

        // インスタンス固有のランダムシードを生成
        this.randomSeed = Math.random() * 10000;

        // ビート単位の時間をミリ秒に変換
        this.attackMs = beatsToMs(params.attackTime, bpm);
        this.decayMs = beatsToMs(params.decayTime, bpm);
        this.releaseMs = beatsToMs(params.releaseTime, bpm);
        this.noteDurationMs = beatsToMs(params.noteDuration, bpm);

        // 全生存時間を計算（Attack開始〜Release終了）
        this.totalLifetimeMs = this.noteDurationMs + this.releaseMs;

        // イージング関数を設定（デフォルト: linear）
        this.easingFunction = movementParams?.easing ?? linear;
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
        this.updatePosition(p, elapsed);
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
     */
    protected processSustainPhase(elapsed: number): void {
        if (elapsed < this.noteDurationMs) {
            this.currentLevel = this.params.sustainLevel;
        } else {
            this.currentPhase = 'RELEASE';
        }
    }

    /**
     * Releaseフェーズの処理
     */
    protected processReleasePhase(elapsed: number): void {
        const releaseStart = this.noteDurationMs;
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
     * @param p - p5インスタンス
     * @param elapsed - 生成からの経過時間（ミリ秒）
     */
    protected updatePosition(p: p5, elapsed: number): void {
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

        // 角度LFOを適用
        if (this.movementParams.angleLFO) {
            const time = elapsed / 1000; // 秒単位
            const angleLFOValue = Math.sin(time * this.movementParams.angleLFORate * Math.PI * 2)
                * this.movementParams.angleLFODepth;
            angle += angleLFOValue;
        }

        // 角度をラジアンに変換
        const angleRad = (angle * Math.PI) / 180;

        // 新しい位置を計算
        this.x = this.startX + Math.cos(angleRad) * currentDistance;
        this.y = this.startY + Math.sin(angleRad) * currentDistance;
    }

    // ========================================
    // プロテクテッドメソッド: LFO計算
    // ========================================

    /**
     * LFO（Low Frequency Oscillator）の値を計算
     * 
     * @param p - p5インスタンス
     * @returns LFOによる変調値（ピクセル）
     */
    protected calculateLFO(p: p5): number {
        const time = (p.millis() - this.startTime) / 1000;
        return Math.sin(time * this.params.lfoRate * Math.PI * 2) * this.params.lfoDepth;
    }

    /**
     * オフセット付きLFOの値を計算（各頂点で異なる位相用）
     * 
     * @param p - p5インスタンス
     * @param phaseOffset - 位相オフセット（0～1）
     * @returns LFOによる変調値（ピクセル）
     */
    protected calculateLFOWithOffset(p: p5, phaseOffset: number): number {
        const time = (p.millis() - this.startTime) / 1000;
        return Math.sin((time * this.params.lfoRate + phaseOffset) * Math.PI * 2) * this.params.lfoDepth;
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
     * @param tex - 描画先のGraphicsオブジェクト
     */
    protected setupDrawing(tex: p5.Graphics): void {
        tex.push();
        tex.colorMode(tex.HSB);

        const alpha = this.currentLevel * 255;
        tex.fill(
            this.params.colorParams.hue,
            this.params.colorParams.saturation,
            this.params.colorParams.brightness,
            alpha
        );
        tex.noStroke();
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

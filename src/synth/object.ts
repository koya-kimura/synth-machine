import p5 from "p5";
import type { SynthParams } from "./synthTypes";
import { ADSRPhase, beatsToMs } from "./synthTypes";

/**
 * SynthObject - 自律的なシンセサイザービジュアルオブジェクト
 * 
 * このクラスは、ADSRエンベロープに基づいてライフサイクルを管理する
 * ビジュアルシンセサイザーオブジェクトを表現します。
 * 
 * 主な機能：
 * - ADSRエンベロープによる音量制御のシミュレーション
 * - LFO（Low Frequency Oscillator）による周期的な変調
 * - 色相・彩度・明度によるビジュアル表現
 * - 自動的なライフサイクル管理（生成→消滅）
 */
export class SynthObject {
    // ========================================
    // プライベートプロパティ
    // ========================================

    /** 描画位置: X座標 */
    private x: number;

    /** 描画位置: Y座標 */
    private y: number;

    /** オブジェクト生成時刻（ミリ秒） */
    private startTime: number;

    /** BPM（Beats Per Minute） */
    private bpm: number;

    /** シンセサイザーパラメータ */
    private params: SynthParams;

    /** 現在のADSRフェーズ */
    private currentPhase: ADSRPhase;

    /** 現在のエンベロープレベル（0.0～1.0） */
    private currentLevel: number;

    /** 基本サイズ（ピクセル） */
    private baseSize: number;

    // ビート→ミリ秒変換済みのタイムパラメータ
    /** アタック時間（ミリ秒） */
    private attackMs: number;

    /** ディケイ時間（ミリ秒） */
    private decayMs: number;

    /** リリース時間（ミリ秒） */
    private releaseMs: number;

    /** ノート継続時間（ミリ秒） */
    private noteDurationMs: number;

    // ========================================
    // コンストラクタ
    // ========================================

    /**
     * SynthObjectを生成
     * 
     * @param x - X座標
     * @param y - Y座標
     * @param startTime - 生成時刻（p.millis()の値）
     * @param bpm - BPM
     * @param params - シンセサイザーパラメータ
     * @param baseSize - 基本サイズ（デフォルト: 50）
     */
    constructor(
        x: number,
        y: number,
        startTime: number,
        bpm: number,
        params: SynthParams,
        baseSize: number = 50
    ) {
        this.x = x;
        this.y = y;
        this.startTime = startTime;
        this.bpm = bpm;
        this.params = params;
        this.baseSize = baseSize;
        this.currentPhase = ADSRPhase.ATTACK;
        this.currentLevel = 0;

        // ビート単位の時間をミリ秒に変換
        // これにより、後続の計算でBPMを気にする必要がなくなる
        this.attackMs = beatsToMs(params.attackTime, bpm);
        this.decayMs = beatsToMs(params.decayTime, bpm);
        this.releaseMs = beatsToMs(params.releaseTime, bpm);
        this.noteDurationMs = beatsToMs(params.noteDuration, bpm);
    }

    // ========================================
    // パブリックメソッド
    // ========================================

    /**
     * オブジェクトの状態を更新
     * 
     * 経過時間に基づいてADSRエンベロープを計算し、
     * 現在のフェーズとレベルを更新します。
     * 
     * @param p - p5インスタンス（現在時刻の取得に使用）
     */
    update(p: p5): void {
        const elapsed = p.millis() - this.startTime;

        // ADSRエンベロープの計算とフェーズ遷移
        this.updateADSREnvelope(elapsed);
    }

    /**
     * オブジェクトを描画
     * 
     * 現在のエンベロープレベルとLFOに基づいて、
     * 円を描画します。色はHSBモードで指定されます。
     * 
     * @param p - p5インスタンス
     * @param tex - 描画先のGraphicsオブジェクト
     */
    display(p: p5, tex: p5.Graphics): void {
        // LFOによる周期的な変調を計算
        const lfoValue = this.calculateLFO(p);

        // ADSRレベルとLFOを組み合わせて半径を決定
        const radius = this.calculateRadius(lfoValue);

        // 色と透明度を設定して描画
        this.drawCircle(tex, radius);
    }

    /**
     * オブジェクトが消滅したかどうかを判定
     * 
     * @returns DEADフェーズに達した場合true
     */
    isDead(): boolean {
        return this.currentPhase === ADSRPhase.DEAD;
    }

    // ========================================
    // プライベートメソッド: ADSR計算
    // ========================================

    /**
     * ADSRエンベロープを更新
     * 
     * 経過時間に基づいて現在のフェーズとレベルを計算します。
     * ADSRとは：
     * - Attack: 音が立ち上がるまでの時間
     * - Decay: 最大音量からサスティンレベルまで減衰する時間
     * - Sustain: 持続する音量レベル
     * - Release: 音が消えるまでの時間
     * 
     * @param elapsed - 生成からの経過時間（ミリ秒）
     */
    private updateADSREnvelope(elapsed: number): void {
        switch (this.currentPhase) {
            case ADSRPhase.ATTACK:
                this.processAttackPhase(elapsed);
                break;

            case ADSRPhase.DECAY:
                this.processDecayPhase(elapsed);
                break;

            case ADSRPhase.SUSTAIN:
                this.processSustainPhase(elapsed);
                break;

            case ADSRPhase.RELEASE:
                this.processReleasePhase(elapsed);
                break;

            case ADSRPhase.DEAD:
                // 何もしない
                break;
        }
    }

    /**
     * Attackフェーズの処理
     * レベルを0から1まで線形に上昇させる
     */
    private processAttackPhase(elapsed: number): void {
        if (elapsed < this.attackMs) {
            // Attack中: 0→1に線形補間
            this.currentLevel = elapsed / this.attackMs;
        } else {
            // Attack完了: Decayフェーズへ移行
            this.currentLevel = 1;
            this.currentPhase = ADSRPhase.DECAY;
        }
    }

    /**
     * Decayフェーズの処理
     * レベルを1からサスティンレベルまで線形に減衰させる
     */
    private processDecayPhase(elapsed: number): void {
        const decayElapsed = elapsed - this.attackMs;

        if (decayElapsed < this.decayMs) {
            // Decay中: 1→sustainLevelに線形補間
            const decayProgress = decayElapsed / this.decayMs;
            this.currentLevel = 1 - (1 - this.params.sustainLevel) * decayProgress;
        } else {
            // Decay完了: Sustainフェーズへ移行
            this.currentLevel = this.params.sustainLevel;
            this.currentPhase = ADSRPhase.SUSTAIN;
        }
    }

    /**
     * Sustainフェーズの処理
     * サスティンレベルを維持し、ノート継続時間後にReleaseへ移行
     */
    private processSustainPhase(elapsed: number): void {
        if (elapsed < this.noteDurationMs) {
            // Sustain中: レベルを維持
            this.currentLevel = this.params.sustainLevel;
        } else {
            // ノート終了: Releaseフェーズへ移行
            this.currentPhase = ADSRPhase.RELEASE;
        }
    }

    /**
     * Releaseフェーズの処理
     * サスティンレベルから0まで線形に減衰させる
     */
    private processReleasePhase(elapsed: number): void {
        const releaseStart = this.noteDurationMs;
        const releaseElapsed = elapsed - releaseStart;

        if (releaseElapsed < this.releaseMs) {
            // Release中: sustainLevel→0に線形補間
            const releaseProgress = releaseElapsed / this.releaseMs;
            this.currentLevel = this.params.sustainLevel * (1 - releaseProgress);
        } else {
            // Release完了: DEADフェーズへ移行
            this.currentLevel = 0;
            this.currentPhase = ADSRPhase.DEAD;
        }
    }

    // ========================================
    // プライベートメソッド: ビジュアル計算
    // ========================================

    /**
     * LFO（Low Frequency Oscillator）の値を計算
     * 
     * LFOは低周波発振器で、周期的な変調を生み出します。
     * サイン波を使用して滑らかな揺れを表現します。
     * 
     * @param p - p5インスタンス
     * @returns LFOによる変調値（ピクセル）
     */
    private calculateLFO(p: p5): number {
        const time = (p.millis() - this.startTime) / 1000; // 秒単位
        return Math.sin(time * this.params.lfoRate * Math.PI * 2) * this.params.lfoDepth;
    }

    /**
     * 描画する円の半径を計算
     * 
     * 基本サイズ、ADSRレベル、LFOを組み合わせて最終的な半径を決定します。
     * 
     * @param lfoValue - LFOによる変調値
     * @returns 半径（ピクセル）
     */
    private calculateRadius(lfoValue: number): number {
        return this.baseSize * this.currentLevel + lfoValue;
    }

    /**
     * 円を描画
     * 
     * HSBカラーモードを使用し、透明度はADSRレベルに連動します。
     * 
     * @param tex - 描画先のGraphicsオブジェクト
     * @param radius - 半径
     */
    private drawCircle(tex: p5.Graphics, radius: number): void {
        tex.push();

        // HSBカラーモードに切り替え
        tex.colorMode(tex.HSB);

        // 透明度はADSRレベルに連動（0～255）
        const alpha = this.currentLevel * 255;

        // 塗りつぶし色を設定
        tex.fill(
            this.params.colorParams.hue,
            this.params.colorParams.saturation,
            this.params.colorParams.brightness,
            alpha
        );

        // 輪郭線なしで円を描画
        tex.noStroke();
        tex.circle(this.x, this.y, radius * 2);

        tex.pop();
    }

    // ========================================
    // ゲッターメソッド: UI表示用
    // ========================================

    /**
     * アタック時間を取得（ビート単位）
     */
    get attack(): number {
        return this.params.attackTime;
    }

    /**
     * ディケイ時間を取得（ビート単位）
     */
    get decay(): number {
        return this.params.decayTime;
    }

    /**
     * サスティンレベルを取得（0.0～1.0）
     */
    get sustain(): number {
        return this.params.sustainLevel;
    }

    /**
     * リリース時間を取得（ビート単位）
     */
    get release(): number {
        return this.params.releaseTime;
    }

    /**
     * 周波数を取得（Hz）
     * 現在はプレースホルダーとして440Hzを返す
     */
    get frequency(): number {
        return 440;
    }

    /**
     * 現在の振幅を取得（0.0～1.0）
     * ADSRエンベロープの現在のレベルを返す
     */
    get amplitude(): number {
        return this.currentLevel;
    }
}

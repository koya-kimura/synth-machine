import type { Pattern } from "./patternTypes";

/**
 * PatternPlayer - パターン再生管理クラス
 * 
 * 選択されたパターンを8拍ループで再生します。
 * 小数点のbeat（例: 1.3拍目）に対応しています。
 */
export class PatternPlayer {
    /** 現在選択されているパターン */
    private currentPattern: Pattern | null = null;

    /** 前回再生した時のビート値（重複再生防止用） */
    private lastProcessedBeat: number = -1;

    /** ビート判定の許容誤差（ミリ秒単位での微小な変動を吸収） */
    private readonly BEAT_TOLERANCE = 0.01;

    /**
     * パターンを設定
     * 
     * @param pattern 再生するパターン。nullで停止
     */
    setPattern(pattern: Pattern | null): void {
        this.currentPattern = pattern;
        this.lastProcessedBeat = -1;
    }

    /**
     * 現在のビートで再生すべきプリセットを取得
     * 
     * 小数点のbeatに対応するため、範囲判定を使用します。
     * 例: beat 1.3 のイベントは、currentBeatが1.29～1.31の範囲で再生
     * 
     * @param currentBeat 現在のビート（BPMManagerから取得）
     * @param deltaTime フレーム間の経過時間（ミリ秒）
     * @returns 再生すべきプリセットインデックスの配列
     */
    getEventsToPlay(currentBeat: number, deltaTime: number = 16): number[] {
        if (!this.currentPattern || this.currentPattern.events.length === 0) {
            return [];
        }

        // 8拍ループなので、ビートを0-8の範囲に正規化
        const normalizedBeat = currentBeat % 8;

        // 前回と大きく変わっていない場合はスキップ（重複再生防止）
        if (Math.abs(normalizedBeat - this.lastProcessedBeat) < 0.01) {
            return [];
        }

        // deltaTimeからビート範囲を計算（BPM120で1秒=2ビート）
        // 例: 16ms @ 120BPM = 約0.032ビート
        const bpm = 120; // 仮のBPM。本来はBPMManagerから取得すべきだが、ここでは固定
        const beatRange = (deltaTime / 1000) * (bpm / 60);

        // 前回のビートから現在のビートまでの範囲でイベントをチェック
        const prevBeat = this.lastProcessedBeat < 0 ? normalizedBeat : this.lastProcessedBeat;

        this.lastProcessedBeat = normalizedBeat;

        // ループの境界をまたぐ場合の処理
        const shouldCheckWrap = prevBeat > normalizedBeat;

        const presetsToPlay = this.currentPattern.events
            .filter(event => {
                if (shouldCheckWrap) {
                    // ループがリセットされた場合
                    return event.beat >= prevBeat || event.beat <= normalizedBeat + this.BEAT_TOLERANCE;
                } else {
                    // 通常のケース
                    return event.beat >= prevBeat - this.BEAT_TOLERANCE &&
                        event.beat <= normalizedBeat + this.BEAT_TOLERANCE;
                }
            })
            .map(event => event.presetIndex);

        return presetsToPlay;
    }

    /**
     * 現在のパターン名を取得
     */
    getCurrentPatternName(): string | null {
        return this.currentPattern?.name || null;
    }

    /**
     * パターンをリセット
     */
    reset(): void {
        this.lastProcessedBeat = -1;
    }
}

import type p5 from "p5";

/**
 * ループ記録されたイベント
 */
interface LooperEvent {
    presetIndex: number;  // どのプリセットがトリガーされたか
    timestamp: number;    // いつトリガーされたか（ミリ秒）
    beat: number;         // どのビートでトリガーされたか
}

/**
 * ルーパークラス
 * プリセットトリガーイベントを記録し、ループ再生する
 */
export class Looper {
    private events: LooperEvent[] = [];
    private isRecording: boolean = false;
    private isPlaying: boolean = false;
    private recordStartTime: number = 0;
    private recordStartBeat: number = 0;
    private loopDuration: number = 0;
    private loopStartTime: number = 0;

    /**
     * 録音を開始
     */
    startRecording(currentTime: number, currentBeat: number): void {
        this.isRecording = true;
        this.isPlaying = false;
        this.events = [];
        this.recordStartTime = currentTime;
        this.recordStartBeat = currentBeat;
    }

    /**
     * 録音を停止して再生を開始
     */
    stopRecordingAndPlay(currentTime: number, currentBeat: number): void {
        this.isRecording = false;

        // イベントが記録されていない場合は何もしない
        if (this.events.length === 0) {
            return;
        }

        // ループ長を計算
        this.loopDuration = currentTime - this.recordStartTime;
        this.loopStartTime = currentTime;
        this.isPlaying = true;
    }

    /**
     * イベントを記録
     */
    recordEvent(presetIndex: number, currentTime: number, currentBeat: number): void {
        if (!this.isRecording) {
            return;
        }

        this.events.push({
            presetIndex,
            timestamp: currentTime,
            beat: currentBeat,
        });
    }

    /**
     * 現在のタイミングで再生すべきイベントのプリセットインデックスを返す
     */
    getEventsToPlay(currentTime: number, deltaTime: number = 16): number[] {
        if (!this.isPlaying || this.events.length === 0 || this.loopDuration === 0) {
            return [];
        }

        // ループ内の現在位置を計算
        const loopPosition = (currentTime - this.loopStartTime) % this.loopDuration;
        const prevLoopPosition = loopPosition - deltaTime;

        // このフレーム内で再生すべきイベントをフィルタ
        return this.events
            .filter(event => {
                const eventPosition = event.timestamp - this.recordStartTime;

                // ループの境界をまたぐ場合の処理
                if (prevLoopPosition < 0) {
                    // ループ終端か開始部分のイベント
                    return eventPosition >= this.loopDuration + prevLoopPosition || eventPosition < loopPosition;
                } else if (prevLoopPosition > loopPosition) {
                    // ループがリセットされた
                    return eventPosition >= prevLoopPosition || eventPosition < loopPosition;
                } else {
                    // 通常のケース
                    return eventPosition >= prevLoopPosition && eventPosition < loopPosition;
                }
            })
            .map(event => event.presetIndex);
    }

    /**
     * ループをクリア
     */
    clear(): void {
        this.events = [];
        this.isRecording = false;
        this.isPlaying = false;
        this.recordStartTime = 0;
        this.recordStartBeat = 0;
        this.loopDuration = 0;
        this.loopStartTime = 0;
    }

    /**
     * 現在のステートを取得
     */
    getState(): "idle" | "recording" | "playing" {
        if (this.isRecording) {
            return "recording";
        } else if (this.isPlaying) {
            return "playing";
        } else {
            return "idle";
        }
    }

    /**
     * 記録されているイベント数を取得
     */
    getEventCount(): number {
        return this.events.length;
    }
}

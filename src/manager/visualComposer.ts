import p5 from "p5";
import type { APCMiniMK2Manager } from "../midi/apcmini_mk2/apcMiniMk2Manager";
import type { AudioMicManager } from "../utils/audio/audioMicManager";
import type { CaptureManager } from "../utils/capture/captureManager";
import type { BPMManager } from "../utils/rhythm/bpmManager";
import { SynthObject } from "../synth/object";
import { PRESETS } from "../synth/presets";

/**
 * VisualComposer はレンダーターゲットとアクティブなビジュアル1つを管理する。
 */
export class VisualComposer {
  private renderTexture: p5.Graphics | undefined; // ビジュアル描画用のオフスクリーンキャンバス
  private synthObjects: SynthObject[] = []; // SynthObjectの配列
  private presets: Array<(p: p5, centerX: number, centerY: number, bpm: number, startTime: number) => SynthObject[]>; // プリセットの配列

  constructor() {
    this.renderTexture = undefined;
    // プリセット配列を直接インポート
    this.presets = PRESETS;
  }

  /**
   * ビジュアル描画用の `p5.Graphics` を生成する。
   *
   * @param p p5 インスタンス。
   */
  init(p: p5): void {
    this.renderTexture = p.createGraphics(p.width, p.height);
  }

  /**
   * ビジュアル描画結果を保持している `p5.Graphics` を返す。
   *
   * @returns ビジュアルテクスチャ。
   * @throws Error 初期化前に呼び出された場合。
   */
  getTexture(): p5.Graphics {
    if (!this.renderTexture) {
      throw new Error("Render texture not initialized");
    }
    return this.renderTexture;
  }

  /**
   * テクスチャが初期化されていることを保証する。
   *
   * @returns テクスチャ。
   * @throws Error 初期化されていない場合。
   */
  private ensureTexture(): p5.Graphics {
    if (!this.renderTexture) {
      throw new Error("Render texture not initialized");
    }
    return this.renderTexture;
  }

  /**
   * ビジュアルの更新処理。
   *
   * @param p p5 インスタンス。
   * @param midiManager MIDI 状態。
   * @param _beat 現在のビート。
   * @param _audioManager オーディオマネージャー。
   * @param _captureManager キャプチャマネージャー。
   * @param _font フォント。
   * @param bpmManager BPMマネージャー。
   */
  update(
    p: p5,
    midiManager: APCMiniMK2Manager,
    _beat: number,
    _audioManager?: AudioMicManager,
    _captureManager?: CaptureManager,
    _font?: p5.Font,
    bpmManager?: BPMManager,
  ): void {
    // MIDI入力を1回だけ取得（oneshotは読み取り時に自動リセットされるため）
    const inputs = midiManager.midiInput;

    // プリセット配列をループして動的にチェック
    for (let i = 0; i < this.presets.length; i++) {
      if (inputs[`preset${i}`]) {
        this.spawnPreset(p, i, bpmManager);
      }
    }

    // 全SynthObjectを更新
    this.synthObjects.forEach(obj => obj.update(p));

    // 消滅したObjectを配列から削除
    this.synthObjects = this.synthObjects.filter(obj => !obj.isDead());
  }

  /**
   * ビジュアルを描画する。
   *
   * @param p p5 インスタンス。
   * @param midiManager MIDI 状態。
   * @param _beat 現在のビート。
   * @param _audioManager オーディオマネージャー。
   * @param _captureManager キャプチャマネージャー。
   * @param _font フォント。
   * @param _bpmManager BPMマネージャー。
   */
  draw(
    p: p5,
    _midiManager: APCMiniMK2Manager,
    _beat: number,
    _audioManager?: AudioMicManager,
    _captureManager?: CaptureManager,
    _font?: p5.Font,
    _bpmManager?: BPMManager,
  ): void {
    const tex = this.ensureTexture();

    // 背景をクリア
    tex.push();
    tex.background(0);

    // 全SynthObjectを描画
    this.synthObjects.forEach(obj => obj.display(p, tex));

    tex.pop();
  }

  /**
   * 指定されたプリセットを使用してオブジェクトをスポーン
   * @param p p5 インスタンス
   * @param presetIndex プリセットのインデックス (0-2)
   * @param bpmManager BPMマネージャー
   * @param x X座標 (デフォルト: 中央)
   * @param y Y座標 (デフォルト: 中央)
   */
  spawnPreset(
    p: p5,
    presetIndex: number,
    bpmManager?: BPMManager,
    x?: number,
    y?: number
  ): void {
    const tex = this.ensureTexture();
    const posX = x ?? tex.width / 2;
    const posY = y ?? tex.height / 2;
    const currentBPM = bpmManager?.getBPM() ?? 120; // BPMManagerからBPMを取得、なければデフォルト120

    // 指定されたプリセットを使用して複数オブジェクトをスポーン
    if (presetIndex >= 0 && presetIndex < this.presets.length) {
      const preset = this.presets[presetIndex];
      const newObjects = preset(p, posX, posY, currentBPM, p.millis());

      // スポーンされた全オブジェクトを配列に追加
      this.synthObjects.push(...newObjects);
    }
  }

  /**
   * ウィンドウリサイズに合わせてテクスチャのサイズを更新する。
   *
   * @param p p5 インスタンス。
   */
  resize(p: p5): void {
    const texture = this.ensureTexture();
    texture.resizeCanvas(p.width, p.height);
  }

  /**
   * リソースを解放する。
   */
  dispose(): void {
    this.renderTexture?.remove();
    this.renderTexture = undefined;
  }
}
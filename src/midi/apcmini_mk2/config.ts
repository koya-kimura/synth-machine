/**
 * MIDI設定ファイル
 * APC Mini MK2のボタン・セルの設定を定義します。
 */
import type { ButtonConfig, FaderButtonMode } from "../../types";
import { LED_PALETTE } from "./ledPalette";
import { PRESETS } from "../../synth/presets";

// ========================================
// ボタン設定
// ========================================

/**
 * グリッドボタンの設定
 */

// プリセット用ボタン（動的生成）
const PRESET_BUTTONS: ButtonConfig[] = PRESETS.map((_, index) => {
  const row = Math.floor(index / 8); // 0-3の行
  const col = index % 8;              // 0-7の列

  return {
    key: `preset${index}`,
    type: "oneshot" as const,
    cells: [{ page: 0, row, col }],
    activeColor: LED_PALETTE.CYAN,
    inactiveColor: LED_PALETTE.DIM,
  };
}).slice(0, 32); // 最大32個まで（4行×8列）

// 他の機能用ボタン（手動で追加）
const OTHER_BUTTONS: ButtonConfig[] = [
  // ここに他のボタン設定を追加
  // 例:
  // {
  //   key: "someFeature",
  //   type: "toggle",
  //   cells: [{ page: 0, row: 4, col: 0 }],
  //   activeColor: LED_PALETTE.GREEN,
  //   inactiveColor: LED_PALETTE.DIM,
  // },
];

// 全てのボタンを結合
export const MIDI_BUTTON_CONFIGS: ButtonConfig[] = [
  ...PRESET_BUTTONS,
  ...OTHER_BUTTONS,
];

// ========================================
// フェーダーボタンモード設定
// ========================================

/**
 * フェーダーボタンのモード
 * - "mute": フェーダーボタンON時、フェーダー値を0にミュート
 * - "random": フェーダーボタンON時、フェーダー値をBPM同期でランダムに0/1切り替え
 */
export const FADER_BUTTON_MODE: FaderButtonMode = "random";

// ========================================
// デフォルト値設定
// MIDI接続なしで使用する場合の初期値
// ========================================

/**
 * フェーダーのデフォルト値（9本分: 0-7 + マスター）
 * 値は0.0～1.0の範囲
 */
export const DEFAULT_FADER_VALUES: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

/**
 * フェーダーボタンのデフォルトトグル状態（9本分）
 * true = ON（ミュートまたはランダム有効）
 */
export const DEFAULT_FADER_BUTTON_TOGGLE_STATE: boolean[] = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];

/**
 * サイドボタン（ページ選択）のデフォルトインデックス
 * 0-7の範囲（ページ0～7）
 */
export const DEFAULT_PAGE_INDEX: number = 0;

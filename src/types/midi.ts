/**
 * MIDI 関連で共有する型定義。
 * APC Mini MK2 以外のデバイスにも転用できるよう最小限の構造にまとめる。
 */

/**
 * MIDI グリッドやボタンの入力タイプ。
 */
export type InputType =
  | "radio"      // 複数セルから1つを選択
  | "toggle"     // ON/OFFトグル
  | "oneshot"    // 押した瞬間のみON
  | "momentary"  // 押している間だけON
  | "random"     // ランダム切り替え
  | "sequence"   // シーケンスパターン
  | "multistate"; // 押すたびにステートが変化（0→1→2→...→0）

/**
 * APC Mini MK2 のセル位置（ページ・行・列）を表現する。
 */
export interface CellPosition {
  page?: number; // デフォルト: 0
  row: number; // 0=上, 7=下
  col: number; // 0=左, 7=右
}

/**
 * MIDI ボタン登録時に使用する共通設定。
 */
export interface ButtonConfig {
  key: string;
  type: InputType;
  cells: CellPosition[];
  activeColor?: number;
  inactiveColor?: number;
  defaultValue?: number | boolean;

  // random用
  randomTarget?: string;
  excludeCurrent?: boolean;

  // random, sequence用
  speed?: number;

  // sequence用
  initialPattern?: boolean[];
  onColor?: number;
  offColor?: number;

  // multistate用
  stateCount?: number;      // ステート数（デフォルト: 2）
  stateColors?: number[];   // 各ステートの色配列
}

/**
 * MIDI 入力値。radio は number、それ以外は boolean を想定。
 */
export type MidiInputValue = number | boolean;

/**
 * フェーダーボタンのモード種別。
 */
export type FaderButtonMode = "mute" | "random";

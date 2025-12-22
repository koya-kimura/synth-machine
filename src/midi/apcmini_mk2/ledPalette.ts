/**
 * LEDカラーパレット定義
 * APC Mini MK2のLED色を定義します。
 */

/** LEDカラーパレット */
export const LED_PALETTE = {
  OFF: 0,
  ON: 3,
  DIM: 1,

  // 基本色
  RED: 5,
  ORANGE: 60,
  YELLOW: 13,
  GREEN: 21,
  CYAN: 32,
  BLUE: 37,
  PURPLE: 53,
  PINK: 56,
} as const;

/** プリセットカテゴリごとのLED色 */
export const CATEGORY_LED_COLORS: Record<string, number> = {
  kick: LED_PALETTE.RED,
  bass: LED_PALETTE.ORANGE,
  snare: LED_PALETTE.YELLOW,
  hihat: LED_PALETTE.GREEN,
  percussion: LED_PALETTE.CYAN,
  lead: LED_PALETTE.BLUE,
  pad: LED_PALETTE.PURPLE,
  fx: LED_PALETTE.PINK,
};

/**
 * プリセット名からカテゴリを抽出してLED色を取得
 * @param presetName プリセット名（例: "kick01"）
 * @returns LED色の値
 */
export function getPresetCategoryColor(presetName: string): number {
  const category = presetName.replace(/\d+$/, ''); // 末尾の数字を削除
  return CATEGORY_LED_COLORS[category] ?? LED_PALETTE.DIM;
}

/** ページごとのLED色（LED_PALETTEを参照） */
export const PAGE_LED_PALETTE = [
  LED_PALETTE.RED, // page 0
  LED_PALETTE.ORANGE, // page 1
  LED_PALETTE.PINK, // page 2
  LED_PALETTE.PURPLE, // page 3
  LED_PALETTE.BLUE, // page 4
  LED_PALETTE.CYAN, // page 5
  LED_PALETTE.GREEN, // page 6
  LED_PALETTE.YELLOW, // page 7
] as const;

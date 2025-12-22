/**
 * カラーパレット定義
 * mainColor: メインカラー（ベース）
 * subColor: サブカラー（補色系）
 * accentColor: アクセントカラー（目立つ色）
 */

export interface ColorPalette {
  mainColor: string;
  subColor: string;
  accentColor: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  // 1. 赤メイン × 青サブ × 黄アクセント（トリコロール）
  { mainColor: "#0f162fff", subColor: "#10fa1bff", accentColor: "#e2debcff" },

  // 2. オレンジメイン × 紫サブ × シアンアクセント
  { mainColor: "#eb2929ff", subColor: "#2626daff", accentColor: "#f3f320ff" },

  // 3. ピンクメイン × 緑サブ × 黄アクセント
  { mainColor: "#ff2970ff", subColor: "#13c31cff", accentColor: "#13abcaff" },

  // 4. 青メイン × オレンジサブ × ライムアクセント
  { mainColor: "#1060ebff", subColor: "#fde424ff", accentColor: "#f70becff" },

  // 5. 紫メイン × 黄緑サブ × オレンジアクセントs
  { mainColor: "#9C27B0", subColor: "#8BC34A", accentColor: "#FF9800" },

  // 6. ティールメイン × 赤サブ × 黄アクセント
  { mainColor: "#00897B", subColor: "#D32F2F", accentColor: "#FFD600" },

  // 7. インディゴメイン × ピンクサブ × シアンアクセント
  { mainColor: "#3949AB", subColor: "#F06292", accentColor: "#00E5FF" },
];

/**
 * インデックスでパレットを取得
 */
export const getPalette = (index: number): ColorPalette => {
  return COLOR_PALETTES[index % COLOR_PALETTES.length];
};

// ========================================
// SynthObject用カラーパレット
// コントラストの高い虹色8色
// ========================================

/**
 * SynthObject用カラーパレット
 * コントラストの高い11色（HEX形式）
 */
export const SYNTH_COLORS = {
  RED: "#C7190C",          // 赤
  RED_PURPLE: "#A10648",   // 赤紫
  ORANGE: "#FC4622",       // オレンジ
  YELLOW: "#F2F300",       // 黄
  GREEN: "#00E065",        // 緑
  LIGHT_BLUE: "#78FFC7",   // ライトブルー
  BLUE: "#4C00D2",         // 青
  DARK_BLUE: "#1D0053",    // ダークブルー
  PINK: "#FF50CB",         // ピンク
  PURPLE: "#A52EF8",       // 紫
  BROWN: "#B46600",        // 茶
} as const;

/** SYNTH_COLORSのキー型 */
export type SynthColorKey = keyof typeof SYNTH_COLORS;

/**
 * HEX色をHSB値に変換
 * @param hex HEX形式の色（例: "#FF1744"）
 * @returns { hue: 0-360, saturation: 0-100, brightness: 0-100 }
 */
export function hexToHSB(hex: string): { hue: number; saturation: number; brightness: number } {
  // HEXからRGBに変換
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex);
  if (!result) {
    return { hue: 0, saturation: 0, brightness: 100 };
  }

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    hue: Math.round(h * 360),
    saturation: Math.round(s * 100),
    brightness: Math.round(v * 100),
  };
}

/**
 * SYNTH_COLORSのキーからHSB値を取得
 */
export function getSynthColorHSB(key: SynthColorKey): { hue: number; saturation: number; brightness: number } {
  return hexToHSB(SYNTH_COLORS[key]);
}


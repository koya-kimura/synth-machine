/**
 * プリセットのエクスポート
 */
export { createThreeCirclesPreset } from "./preset1";
export { createVerticalCirclesPreset } from "./preset2";
export { createGridCirclesPreset } from "./preset3";

import { createThreeCirclesPreset } from "./preset1";
import { createVerticalCirclesPreset } from "./preset2";
import { createGridCirclesPreset } from "./preset3";

/**
 * プリセット配列
 * この配列の順番がMIDIボタンの順番になります（最大32個）
 * 新しいプリセットを追加したい場合は、ここに追加するだけでOKです
 */
export const PRESETS = [
    createThreeCirclesPreset,    // index 0 → ボタン (0, 0)
    createVerticalCirclesPreset, // index 1 → ボタン (0, 1)
    createGridCirclesPreset,     // index 2 → ボタン (0, 2)
    // 新しいプリセットをここに追加
];

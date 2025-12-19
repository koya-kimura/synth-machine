/**
 * プリセットのエクスポート
 */
import p5 from "p5";
import { BaseSynthObject } from "../object";
import { createThreeCirclesPreset } from "./preset1";
import { createVerticalCirclesPreset } from "./preset2";
import { createGridCirclesPreset } from "./preset3";

/**
 * プリセット配列
 * この配列の順番がMIDIボタンの順番になります（最大32個）
 */
export const PRESETS: Array<(p: p5, bpm: number, startTime: number) => BaseSynthObject[]> = [
    createThreeCirclesPreset,    // index 0 → ボタン (0, 0)
    createVerticalCirclesPreset, // index 1 → ボタン (0, 1)
    createGridCirclesPreset,     // index 2 → ボタン (0, 2)
];

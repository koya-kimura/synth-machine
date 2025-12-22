import type { Pattern } from "./patternTypes";
import { getPresetIndex } from "../presets";

/**
 * 事前定義パターン集
 * 
 * 16個のパターンを定義します。
 * 各パターンは8拍ループで、どのタイミングでどのプリセットを鳴らすかを指定します。
 */

export const PRESET_PATTERNS: Pattern[] = [
    // パターン0: 4つ打ち（基本的なキックドラムパターン）
    {
        name: "Four Kick",
        events: [
            { beat: 0, presetIndex: getPresetIndex('kick01') },
            { beat: 1, presetIndex: getPresetIndex('kick01') },
            { beat: 2, presetIndex: getPresetIndex('kick01') },
            { beat: 3, presetIndex: getPresetIndex('kick01') },
            { beat: 4, presetIndex: getPresetIndex('kick01') },
            { beat: 5, presetIndex: getPresetIndex('kick01') },
            { beat: 6, presetIndex: getPresetIndex('kick01') },
            { beat: 7, presetIndex: getPresetIndex('kick01') },
        ]
    },
    // パターン0: 4つ打ち（基本的なキックドラムパターン）
    {
        name: "Polygons",
        events: [
            { beat: 0, presetIndex: getPresetIndex('kick02') },
            { beat: 0.5, presetIndex: getPresetIndex('hihat01') },
            { beat: 1, presetIndex: getPresetIndex('snare03') },
            { beat: 1.5, presetIndex: getPresetIndex('hihat01') },
            { beat: 2, presetIndex: getPresetIndex('kick02') },
            { beat: 2.5, presetIndex: getPresetIndex('hihat01') },
            { beat: 3, presetIndex: getPresetIndex('snare03') },
            { beat: 3.5, presetIndex: getPresetIndex('hihat01') },
            { beat: 4, presetIndex: getPresetIndex('kick02') },
            { beat: 4.5, presetIndex: getPresetIndex('hihat01') },
            { beat: 5, presetIndex: getPresetIndex('snare03') },
            { beat: 5.5, presetIndex: getPresetIndex('hihat01') },
            { beat: 6, presetIndex: getPresetIndex('snare03') },
            { beat: 6.5, presetIndex: getPresetIndex('hihat01') },
            { beat: 7, presetIndex: getPresetIndex('snare03') },
            { beat: 7.5, presetIndex: getPresetIndex('hihat01') },
        ]
    },
    // パターン0: 4つ打ち（基本的なキックドラムパターン）
    {
        name: "Fly Move",
        events: [
            { beat: 0, presetIndex: getPresetIndex('lead05') },
            { beat: 0, presetIndex: getPresetIndex('snare04') },
            { beat: 1, presetIndex: getPresetIndex('snare04') },
            { beat: 2, presetIndex: getPresetIndex('lead05') },
            { beat: 3, presetIndex: getPresetIndex('snare04') },
            { beat: 4, presetIndex: getPresetIndex('lead05') },
            { beat: 5, presetIndex: getPresetIndex('snare04') },
            { beat: 6, presetIndex: getPresetIndex('lead05') },
        ]
    },
    // パターン0: 4つ打ち（基本的なキックドラムパターン）
    {
        name: "Toggle Rect",
        events: [
            { beat: 0, presetIndex: getPresetIndex('bass01') },
            { beat: 2, presetIndex: getPresetIndex('bass01') },
            { beat: 3, presetIndex: getPresetIndex('snare05') },
            { beat: 3.75, presetIndex: getPresetIndex('hihat02') },
            { beat: 4, presetIndex: getPresetIndex('bass01') },
            { beat: 4.25, presetIndex: getPresetIndex('hihat02') },
            { beat: 6, presetIndex: getPresetIndex('bass01') },
            { beat: 7, presetIndex: getPresetIndex('snare05') },
            { beat: 7.25, presetIndex: getPresetIndex('hihat02') },
            { beat: 7.5, presetIndex: getPresetIndex('hihat02') },
        ]
    },
];
import type { Pattern } from "./patternTypes";

/**
 * 事前定義パターン集
 * 
 * 16個のパターンを定義します。
 * 各パターンは8拍ループで、どのタイミングでどのプリセットを鳴らすかを指定します。
 */

export const PRESET_PATTERNS: Pattern[] = [
    // パターン0: 4つ打ち（基本的なキックドラムパターン）
    {
        name: "4つ打ち",
        events: [
            { beat: 0, presetIndex: 0 },
            { beat: 2, presetIndex: 0 },
            { beat: 4, presetIndex: 0 },
            { beat: 6, presetIndex: 0 },
        ]
    },
];

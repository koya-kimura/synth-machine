/**
 * プリセットのエクスポート
 */
import p5 from "p5";
import { BaseSynthObject } from "../object";
import { kick01 } from "./kick01";
import { kick02 } from "./kick02";
import { kick03 } from "./kick03";

import { snare01 } from "./snare01";
import { snare02 } from "./snare02";
import { snare03 } from "./snare03";
import { snare04 } from "./snare04";
import { snare05 } from "./snare05";

import { hihat01 } from "./hihat01";
import { hihat02 } from "./hihat02";
import { hihat03 } from "./hihat03";

import { percussion01 } from "./percussion01";
import { percussion02 } from "./percussion02";
import { percussion03 } from "./percussion03";
import { percussion04 } from "./percussion04";

import { bass01 } from "./bass01";
import { bass02 } from "./bass02";
import { bass03 } from "./bass03";
import { bass04 } from "./bass04";

import { lead01 } from "./lead01";
import { lead02 } from "./lead02";
import { lead03 } from "./lead03";
import { lead04 } from "./lead04";
import { lead05 } from "./lead05";
import { lead06 } from "./lead06";
import { lead07 } from "./lead07";

import { pad01 } from "./pad01";

import { fx01 } from "./fx01";
import { fx02 } from "./fx02";
import { fx03 } from "./fx03";

/**
 * プリセット配列
 * この配列の順番がMIDIボタンの順番になります（最大32個）
 */
export const PRESETS: Array<(p: p5, bpm: number, startTime: number) => BaseSynthObject[]> = [
    kick01,
    kick02,
    kick03,
    bass01,

    bass02,
    bass03,
    bass04,
    snare01,
    snare02,
    snare03,
    snare04,
    snare05,
    percussion01,
    percussion02,
    percussion03,
    percussion04,

    lead01,
    lead02,
    lead03,
    lead04,
    lead05,

    lead06,
    lead07,
    hihat01,
    hihat02,
    hihat03,
    pad01,
    fx01,
    fx02,
    fx03,
];

/**
 * プリセット名からインデックスを取得
 * @param name プリセット名（例: "kick01"）
 * @returns プリセットのインデックス（見つからない場合は0）
 */
export function getPresetIndex(name: string): number {
    const index = PRESETS.findIndex(p => p.name === name);
    if (index === -1) {
        console.warn(`Preset "${name}" not found, defaulting to 0`);
        return 0;
    }
    return index;
}

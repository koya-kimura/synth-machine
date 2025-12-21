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
import { hihat01 } from "./hihat01";
import { hihat02 } from "./hihat02";
import { hihat03 } from "./hihat03";
import { percussion01 } from "./percussion01";
import { percussion02 } from "./percussion02";
import { bass01 } from "./bass01";
import { bass02 } from "./bass02";
import { lead01 } from "./lead01";
import { lead02 } from "./lead02";
import { pad01 } from "./pad01";

/**
 * プリセット配列
 * この配列の順番がMIDIボタンの順番になります（最大32個）
 */
export const PRESETS: Array<(p: p5, bpm: number, startTime: number) => BaseSynthObject[]> = [
    kick01,
    kick02,
    kick03,
    snare01,
    snare02,
    snare03,
    hihat01,
    hihat02,
    hihat03,
    percussion01,
    percussion02,
    bass01,
    bass02,
    lead01,
    lead02,
    pad01,
];

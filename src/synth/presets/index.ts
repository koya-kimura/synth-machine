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
];

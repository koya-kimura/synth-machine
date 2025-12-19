/**
 * SynthObject - 図形タイプの再エクスポート
 * 
 * 後方互換性のため、CircleSynthObjectをデフォルトのSynthObjectとしてエクスポートします。
 * 新しい図形タイプも個別にエクスポートします。
 */

// 基底クラス
export { BaseSynthObject } from "./baseSynthObject";

// 各図形タイプ
export { CircleSynthObject } from "./circleSynthObject";
export { RectSynthObject, type RectParams } from "./rectSynthObject";
export { PolygonSynthObject, type PolygonParams } from "./polygonSynthObject";

// 後方互換性のため、CircleSynthObjectをSynthObjectとしてエクスポート
export { CircleSynthObject as SynthObject } from "./circleSynthObject";

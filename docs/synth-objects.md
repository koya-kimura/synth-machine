# SynthObject ドキュメント

シンセサイザービジュアルオブジェクトの使い方ガイド。

---

## 概要

SynthObjectは3つの図形タイプをサポートしています：

| クラス | 図形 | 用途 |
|--------|------|------|
| `CircleSynthObject` | 円/楕円 | シンプルな円形アニメーション |
| `RectSynthObject` | 長方形 | 伸縮するバー、パルス |
| `PolygonSynthObject` | 多角形 | 星形、有機的な形状 |

---

## 基本的な使い方

全ての図形はオブジェクト形式で設定を渡します：

```typescript
new CircleSynthObject({
    startTime,          // 生成時刻（p.millis()）
    bpm,                // BPM
    x: p.width / 2,     // X座標
    y: p.height / 2,    // Y座標
    size: 100,          // サイズ（デフォルト: 50）
    angle: 0,           // 回転角度（度、デフォルト: 0）
    params: { ... },    // シンセパラメータ（オプショナル）
    ellipse: { ... },   // 図形固有パラメータ（オプショナル）
    movement: { ... },  // 移動パラメータ（オプショナル）
})
```

---

## SynthParams（全てオプショナル）

```typescript
interface SynthParams {
    attackTime?: number;     // Attack時間（ビート、デフォルト: 0.1）
    decayTime?: number;      // Decay時間（ビート、デフォルト: 0）
    sustainLevel?: number;   // Sustainレベル（0-1、デフォルト: 1.0）
    releaseTime?: number;    // Release時間（ビート、デフォルト: 0.1）
    noteDuration?: number;   // ノート継続時間（ビート、デフォルト: 1.0）
    waveform?: Waveform;     // 波形タイプ（デフォルト: 'sine'）
    lfoType?: LfoType;       // LFO波形（デフォルト: 'sine'）
    lfoRate?: number;        // LFOレート（拍あたり周期数、デフォルト: 0）
    lfoDepth?: number;       // LFO深度（baseSize比、デフォルト: 0）
    colorParams?: ColorParams;
}
```

### LFOパラメータ

**lfoType（LFO波形）:**

| タイプ | 形状 |
|--------|------|
| `sine` | 滑らかな正弦波 |
| `triangle` | 直線的な三角波 |
| `saw` | 鋸波（上昇） |
| `square` | 矩形波 |
| `noise` | ノイズ |

**lfoRate（BPM同期）:**
- `1` = 1拍で1周期
- `2` = 1拍で2周期（2倍速）
- `0.5` = 2拍で1周期（半速）

**lfoDepth（baseSize比）:**
- `1.0` = サイズ0〜2倍を往復
- `0.5` = サイズ0.5〜1.5倍を往復
- `0.1` = 小さな揺れ

> **Note:** `lfoRate`か`lfoDepth`が0の場合、LFOは適用されません。

### カラーパレット（SYNTH_COLORS）

| キー | 色 | HEX |
|------|-----|-----|
| `RED` | 🔴 赤 | #FF1744 |
| `ORANGE` | 🟠 オレンジ | #FF9100 |
| `YELLOW` | 🟡 黄 | #FFEA00 |
| `GREEN` | 🟢 緑 | #00E676 |
| `CYAN` | 🔵 シアン | #00E5FF |
| `BLUE` | 🔵 青 | #2979FF |
| `PURPLE` | 🟣 紫 | #D500F9 |
| `PINK` | 🩷 ピンク | #FF4081 |

---

## CircleSynthObject（円/楕円）

```typescript
new CircleSynthObject({
    startTime, bpm,
    x: p.width / 2,
    y: p.height / 2,
    size: 100,
    angle: 0,
    params: { colorParams: { paletteColor: 'RED' } },
    ellipse: { aspectRatio: 2.0 },  // 横長楕円
})
```

### EllipseParams

| パラメータ | 説明 | デフォルト |
|------------|------|-----------|
| `aspectRatio` | 幅/高さ比（1.0=正円、>1=横長、<1=縦長） | 1.0 |

---

## RectSynthObject（長方形）

```typescript
new RectSynthObject({
    startTime, bpm,
    x: p.width / 2,
    y: p.height / 2,
    size: 100,
    angle: 45,  // 45度回転
    params: { colorParams: { paletteColor: 'ORANGE' } },
    rect: {
        aspectRatio: 4,
        stretchMode: 'horizontal',
    },
})
```

### RectParams

| パラメータ | 説明 | デフォルト |
|------------|------|-----------|
| `aspectRatio` | 幅/高さ比 | 1.0 |
| `stretchMode` | 伸縮モード（uniform/horizontal/vertical） | 'uniform' |
| `lfoWidthRate` | 幅LFOレート（Hz） | 0 |
| `lfoWidthDepth` | 幅LFO深度（px） | 0 |
| `lfoHeightRate` | 高さLFOレート（Hz） | 0 |
| `lfoHeightDepth` | 高さLFO深度（px） | 0 |

---

## PolygonSynthObject（多角形）

```typescript
new PolygonSynthObject({
    startTime, bpm,
    x: p.width / 2,
    y: p.height / 2,
    size: 80,
    angle: 30,  // 30度回転
    params: { colorParams: { paletteColor: 'CYAN' } },
    polygon: {
        sides: 6,
        spikiness: 0.5,  // 星形
    },
})
```

### PolygonParams

| パラメータ | 説明 | デフォルト |
|------------|------|-----------|
| `sides` | 辺の数 | 6 |
| `irregularity` | 不規則性（0-1） | 0 |
| `spikiness` | 窪み度（0=通常、0.5=星形） | 0 |
| `vertexLFO` | 頂点LFO有効化 | false |
| `vertexLFORate` | 頂点LFOレート（Hz） | 0 |
| `vertexLFODepth` | 頂点LFO深度（px） | 0 |

---

## MovementParams（移動）

```typescript
movement: {
    angle: 270,           // 上方向
    distance: 300,        // 300px移動
    angleLFO: true,       // 蛇行
    angleLFORate: 1,
    angleLFODepth: 20,
    easing: easeOutQuad,  // イージング
}
```

| パラメータ | 説明 | デフォルト |
|------------|------|-----------|
| `angle` | 移動角度（ラジアン、0=右、π/2=下、π=左、3π/2=上） | - |
| `distance` | 移動距離（ピクセル） | - |
| `angleLFO` | 角度LFO有効化 | false |
| `angleLFORate` | 角度LFOレート（Hz） | 0 |
| `angleLFODepth` | 角度LFO深度（ラジアン） | 0 |
| `easing` | イージング関数 | linear |

---

## StyleParams（描画スタイル）

```typescript
style: {
    mode: 'stroke',     // 'fill' or 'stroke'
    strokeWeight: 3,    // ストロークの太さ
}
```

| パラメータ | 説明 | デフォルト |
|------------|------|-----------|
| `mode` | 描画モード（'fill'=塗りつぶし、'stroke'=輪郭線） | 'fill' |
| `strokeWeight` | ストロークの太さ（px、modeが'stroke'の場合） | 1 |

---

## プリセット例

```typescript
import p5 from "p5";
import { BaseSynthObject, CircleSynthObject } from "../object";

export const myPreset = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    return [
        new CircleSynthObject({
            startTime,
            bpm,
            x: p.width / 2,
            y: p.height / 2,
            size: Math.min(p.width, p.height) * 0.4,
            angle: 0,
            params: {
                attackTime: 0.02,
                decayTime: 0.5,
                colorParams: { paletteColor: 'RED' }
            }
        })
    ];
};
```

---

## インポート

```typescript
import { 
    CircleSynthObject, 
    RectSynthObject, 
    PolygonSynthObject,
    BaseSynthObject,
    type CircleConfig,
    type RectConfig,
    type PolygonConfig,
    type SynthObjectConfig,
    type MovementParams,
} from "../synth/object";
```

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

## 共通の引数順

**全ての図形で統一された引数順：**

```typescript
new [SynthObject](
    startTime,       // 生成時刻（p.millis()）
    bpm,             // BPM
    x,               // X座標
    y,               // Y座標
    baseSize,        // 基本サイズ（デフォルト: 50）
    params?,         // SynthParams（オプショナル）
    shapeParams?,    // 図形固有パラメータ（オプショナル）
    movementParams?  // MovementParams（オプショナル）
)
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

interface ColorParams {
    hue?: number;           // 色相（0-360、デフォルト: 0）
    saturation?: number;    // 彩度（0-100、デフォルト: 0）
    brightness?: number;    // 明度（0-100、デフォルト: 100）
    paletteColor?: string;  // パレット色（HSBより優先）
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

## MovementParams（オプショナル）

```typescript
interface MovementParams {
    angle: number;           // 移動角度（度、0=右、90=下、180=左、270=上）
    distance: number;        // 移動距離（ピクセル）
    angleLFO?: boolean;      // 角度LFO（デフォルト: false）
    angleLFORate?: number;   // 角度LFOレート（Hz）
    angleLFODepth?: number;  // 角度LFO深度（度）
    easing?: EasingFunction; // イージング関数
}
```

---

## CircleSynthObject（円/楕円）

```typescript
new CircleSynthObject(
    startTime, bpm, x, y,
    baseSize,        // サイズ（半径）
    params?,         // SynthParams
    movementParams?, // MovementParams
    ellipseParams?   // { aspectRatio?: number }
)
```

### EllipseParams

| パラメータ | 説明 | デフォルト |
|------------|------|-----------|
| `aspectRatio` | 幅/高さ比（1.0=正円、>1=横長、<1=縦長） | 1.0 |

### 例：シンプルな円

```typescript
new CircleSynthObject(
    startTime, bpm,
    p.width / 2, p.height / 2,
    100,
    { colorParams: { paletteColor: 'RED' } }
);
```

### 例：横長の楕円

```typescript
new CircleSynthObject(
    startTime, bpm,
    p.width / 2, p.height / 2,
    50,
    { colorParams: { paletteColor: 'CYAN' } },
    undefined,
    { aspectRatio: 2.0 }
);
```

---

## RectSynthObject（長方形）

```typescript
new RectSynthObject(
    startTime, bpm, x, y,
    baseSize,        // 基本サイズ
    params?,         // SynthParams
    movementParams?, // MovementParams
    rectParams?      // RectParams
)
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

### 例：水平に伸縮するバー

```typescript
new RectSynthObject(
    startTime, bpm,
    p.width / 2, p.height / 2,
    100,
    { colorParams: { paletteColor: 'ORANGE' } },
    undefined,
    {
        aspectRatio: 4,
        stretchMode: 'horizontal',
        lfoWidthRate: 2,
        lfoWidthDepth: 100,
    }
);
```

---

## PolygonSynthObject（多角形）

```typescript
new PolygonSynthObject(
    startTime, bpm, x, y,
    baseSize,        // 基本サイズ（半径）
    params?,         // SynthParams
    movementParams?, // MovementParams
    polygonParams?   // PolygonParams
)
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

### 例：六角形

```typescript
new PolygonSynthObject(
    startTime, bpm,
    p.width / 2, p.height / 2,
    80,
    { colorParams: { paletteColor: 'CYAN' } },
    undefined,
    { sides: 6 }
);
```

### 例：星形（10頂点、窪みあり）

```typescript
new PolygonSynthObject(
    startTime, bpm,
    p.width / 2, p.height / 2,
    80,
    { colorParams: { paletteColor: 'YELLOW' } },
    undefined,
    { sides: 10, spikiness: 0.5 }
);
```

---

## プリセットでの使用例

```typescript
import p5 from "p5";
import { BaseSynthObject, CircleSynthObject } from "../object";

export const myPreset = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    return [
        new CircleSynthObject(
            startTime, bpm,
            p.width / 2, p.height / 2,
            Math.min(p.width, p.height) * 0.4,
            {
                attackTime: 0.02,
                decayTime: 0.5,
                colorParams: { paletteColor: 'RED' }
            }
        )
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
    type EllipseParams,
    type RectParams,
    type PolygonParams,
    type MovementParams,
} from "../synth/object";
```

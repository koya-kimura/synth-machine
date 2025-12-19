# SynthObject ドキュメント

シンセサイザービジュアルオブジェクトの使い方ガイド。

---

## 概要

SynthObjectは3つの図形タイプをサポートしています：

| クラス | 図形 | 用途 |
|--------|------|------|
| `CircleSynthObject` | 円 | シンプルな円形アニメーション |
| `RectSynthObject` | 長方形 | 伸縮するバー、パルス |
| `PolygonSynthObject` | 多角形 | 星形、有機的な形状 |

---

## 共通パラメータ（SynthParams）

全ての図形タイプで使用する共通パラメータ：

```typescript
interface SynthParams {
    attackTime: number;    // Attack時間（ビート単位）
    decayTime: number;     // Decay時間（ビート単位）
    sustainLevel: number;  // Sustainレベル（0.0〜1.0）
    releaseTime: number;   // Release時間（ビート単位）
    noteDuration: number;  // ノート継続時間（ビート単位、Releaseが始まるタイミング）
    waveform: Waveform;    // 波形タイプ（'sine' | 'saw' | 'square' | 'noise'）
    lfoRate: number;       // LFOレート（Hz）
    lfoDepth: number;      // LFO深度（ピクセル）
    colorParams: {
        hue: number;        // 色相（0〜360）
        saturation: number; // 彩度（0〜100）
        brightness: number; // 明度（0〜100）
    };
}
```

### ADSRエンベロープ

```
Level
  1 |    /\
    |   /  \____
    |  /        \
  0 |_/          \____
    Attack Decay Sustain Release
```

- **Attack**: 0→1に上昇する時間
- **Decay**: 1→sustainLevelに減衰する時間
- **Sustain**: 維持するレベル（0.0〜1.0）
- **Release**: sustainLevel→0に減衰する時間
- **noteDuration**: Releaseが始まるタイミング

### LFO（Low Frequency Oscillator）

サイズに周期的な揺れを加えます：
- `lfoRate`: 揺れの速さ（Hz、1秒間の振動回数）
- `lfoDepth`: 揺れの振幅（ピクセル）

---

## CircleSynthObject（円）

シンプルな円。元のSynthObjectと同じ動作。

### コンストラクタ

```typescript
new CircleSynthObject(
    x: number,          // X座標
    y: number,          // Y座標
    startTime: number,  // 生成時刻（p.millis()）
    bpm: number,        // BPM
    params: SynthParams,// シンセパラメータ
    baseSize: number    // 基本サイズ（ピクセル、半径）
)
```

### 例

```typescript
new CircleSynthObject(
    p.width / 2,
    p.height / 2,
    p.millis(),
    120,
    {
        attackTime: 0.5,
        decayTime: 0.2,
        sustainLevel: 0.8,
        releaseTime: 1.0,
        noteDuration: 2.0,
        waveform: 'sine',
        lfoRate: 2,
        lfoDepth: 10,
        colorParams: { hue: 180, saturation: 80, brightness: 100 },
    },
    50  // 半径50px
);
```

---

## RectSynthObject（長方形）

幅と高さを独立して制御できる長方形。

### RectParams

```typescript
interface RectParams {
    baseWidth: number;      // 基本幅（ピクセル）
    baseHeight: number;     // 基本高さ（ピクセル）
    stretchMode: 'uniform' | 'horizontal' | 'vertical';
    lfoWidthRate: number;   // 幅LFOレート（Hz）
    lfoWidthDepth: number;  // 幅LFO深度（ピクセル）
    lfoHeightRate: number;  // 高さLFOレート（Hz）
    lfoHeightDepth: number; // 高さLFO深度（ピクセル）
}
```

### stretchMode

| モード | 動作 |
|--------|------|
| `uniform` | 幅と高さが同じLFOで揺れる（共通のlfoRate/lfoDepthを使用） |
| `horizontal` | 幅のみがLFOで伸縮（高さは少し影響） |
| `vertical` | 高さのみがLFOで伸縮（幅は少し影響） |

### コンストラクタ

```typescript
new RectSynthObject(
    x: number,
    y: number,
    startTime: number,
    bpm: number,
    params: SynthParams,
    rectParams: RectParams  // ← 追加パラメータ
)
```

### 例：水平に伸縮するバー

```typescript
new RectSynthObject(
    p.width / 2,
    p.height / 2,
    p.millis(),
    120,
    {
        attackTime: 0.3,
        decayTime: 0.1,
        sustainLevel: 0.9,
        releaseTime: 0.5,
        noteDuration: 2.0,
        waveform: 'sine',
        lfoRate: 1,
        lfoDepth: 0,  // uniformモード以外では使用しない
        colorParams: { hue: 320, saturation: 80, brightness: 100 },
    },
    {
        baseWidth: 200,
        baseHeight: 30,
        stretchMode: 'horizontal',
        lfoWidthRate: 2,      // 幅が2Hzで振動
        lfoWidthDepth: 100,   // 幅が±100px揺れる
        lfoHeightRate: 4,
        lfoHeightDepth: 5,    // 高さは少しだけ揺れる
    }
);
```

### 例：均一に拡大縮小する正方形

```typescript
new RectSynthObject(
    p.width / 2,
    p.height / 2,
    p.millis(),
    120,
    synthParams,
    {
        baseWidth: 100,
        baseHeight: 100,
        stretchMode: 'uniform',
        lfoWidthRate: 0,   // uniformモードでは無視
        lfoWidthDepth: 0,
        lfoHeightRate: 0,
        lfoHeightDepth: 0,
    }
);
```

---

## PolygonSynthObject（多角形）

正多角形から不規則な形状、星形まで様々な多角形。

### PolygonParams

```typescript
interface PolygonParams {
    sides: number;          // 辺の数（3=三角形, 4=四角形, 5=五角形...）
    baseRadius: number;     // 基本半径（ピクセル）
    irregularity: number;   // 不規則性（0.0=正多角形, 1.0=完全ランダム）
    spikiness: number;      // 窪み度（0.0=通常, 0.5=星形, 負=膨らむ）
    vertexLFO: boolean;     // 頂点ごとのLFOを有効化
    vertexLFORate: number;  // 頂点LFOレート（Hz）
    vertexLFODepth: number; // 頂点LFO深度（ピクセル）
}
```

### パラメータ詳細

#### sides（辺の数）
- `3`: 三角形
- `4`: 四角形
- `5`: 五角形
- `6`: 六角形
- 大きい数値ほど円に近づく

#### irregularity（不規則性）
- `0.0`: 完全な正多角形
- `0.1〜0.3`: 少し歪んだ形
- `0.5〜1.0`: かなり不規則

> **Note:** ランダムシードはインスタンス生成時に自動設定されるため、同じパラメータでも毎回異なる形になります。

#### spikiness（窪み度）
- `0.0`: 通常の多角形
- `0.3〜0.5`: 星形（偶数番目の頂点が内側に）
- `1.0`: 極端な星形
- 負の値: 膨らんだ形

#### vertexLFO（頂点LFO）
有効にすると、各頂点が独立した位相でLFOにより揺れます。有機的な動きを表現できます。

### コンストラクタ

```typescript
new PolygonSynthObject(
    x: number,
    y: number,
    startTime: number,
    bpm: number,
    params: SynthParams,
    polygonParams: PolygonParams  // ← 追加パラメータ
)
```

### 例：正六角形

```typescript
new PolygonSynthObject(
    p.width / 2,
    p.height / 2,
    p.millis(),
    120,
    synthParams,
    {
        sides: 6,
        baseRadius: 80,
        irregularity: 0,
        spikiness: 0,
        vertexLFO: false,
        vertexLFORate: 0,
        vertexLFODepth: 0,
    }
);
```

### 例：星形（5つの尖り）

```typescript
new PolygonSynthObject(
    p.width / 2,
    p.height / 2,
    p.millis(),
    120,
    synthParams,
    {
        sides: 10,          // 10頂点で5つの尖り
        baseRadius: 80,
        irregularity: 0,
        spikiness: 0.5,     // 窪ませる
        vertexLFO: false,
        vertexLFORate: 0,
        vertexLFODepth: 0,
    }
);
```

### 例：有機的に揺れる不規則な形

```typescript
new PolygonSynthObject(
    p.width / 2,
    p.height / 2,
    p.millis(),
    120,
    synthParams,
    {
        sides: 8,
        baseRadius: 60,
        irregularity: 0.2,    // 少し不規則
        spikiness: 0,
        vertexLFO: true,      // 頂点LFO有効
        vertexLFORate: 0.5,   // ゆっくり揺れる
        vertexLFODepth: 15,   // ±15pxの揺れ
    }
);
```

---

## プリセットでの使用例

```typescript
// preset例.ts
import p5 from "p5";
import { BaseSynthObject, PolygonSynthObject, type PolygonParams } from "../object";
import type { SynthParams } from "../synthTypes";

export const createMyPreset = (p: p5, bpm: number, startTime: number): BaseSynthObject[] => {
    const objects: BaseSynthObject[] = [];

    const synthParams: SynthParams = {
        attackTime: 0.5,
        decayTime: 0.2,
        sustainLevel: 0.8,
        releaseTime: 1.0,
        noteDuration: 2.0,
        waveform: 'sine',
        lfoRate: 1,
        lfoDepth: 10,
        colorParams: { hue: 200, saturation: 70, brightness: 90 },
    };

    const polygonParams: PolygonParams = {
        sides: 6,
        baseRadius: 80,
        irregularity: 0.1,
        spikiness: 0,
        vertexLFO: true,
        vertexLFORate: 0.5,
        vertexLFODepth: 10,
    };

    objects.push(new PolygonSynthObject(
        p.width / 2,
        p.height / 2,
        startTime,
        bpm,
        synthParams,
        polygonParams
    ));

    return objects;
};
```

---

## インポート

```typescript
// 個別にインポート
import { CircleSynthObject, RectSynthObject, PolygonSynthObject } from "../synth/object";
import type { RectParams, PolygonParams } from "../synth/object";

// 基底クラス（型として使用）
import { BaseSynthObject } from "../synth/object";

// 後方互換（CircleSynthObjectのエイリアス）
import { SynthObject } from "../synth/object";
```

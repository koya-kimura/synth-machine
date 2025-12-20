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
    colorParams: ColorParams;
}

interface ColorParams {
    hue: number;           // 色相（0〜360）
    saturation: number;    // 彩度（0〜100）
    brightness: number;    // 明度（0〜100）
    paletteColor?: string; // パレット色（指定するとHSBより優先）
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

### カラーパレット（SYNTH_COLORS）

コントラストの高い虹色8色のパレット。`paletteColor`を指定するとHSB値より優先されます。

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

### 色指定の例

```typescript
// HSBで直接指定
colorParams: {
    hue: 180,
    saturation: 80,
    brightness: 100,
}

// パレット色を使用（HSBより優先）
colorParams: {
    hue: 0,           // 無視される
    saturation: 0,    // 無視される
    brightness: 0,    // 無視される
    paletteColor: 'CYAN',  // シアンを使用
}
```

---

## 移動機能（MovementParams）

全ての図形タイプで使用できるオプショナルな移動機能です。
Attack開始からRelease終了までの間に、指定した角度・距離で移動します。

### MovementParams

```typescript
interface MovementParams {
    angle: number;           // 移動角度（度、0=右、90=下、180=左、270=上）
    distance: number;        // 移動距離（ピクセル）
    angleLFO: boolean;       // 角度LFOを有効化
    angleLFORate: number;    // 角度LFOレート（Hz）
    angleLFODepth: number;   // 角度LFO深度（度）
    easing?: EasingFunction; // イージング関数（デフォルト: linear）
}
```

### パラメータ詳細

#### angle（移動角度）
- `0`: 右
- `90`: 下
- `180`: 左
- `270`: 上
- 任意の角度を指定可能

#### angleLFO（角度LFO）
有効にすると、移動中に蛇行するような動きになります。
- `angleLFORate`: 蛇行の速さ（Hz）
- `angleLFODepth`: 蛇行の振れ幅（度）

#### easing（イージング）
移動の加減速を制御します。`src/utils/math/easing.ts`から関数をインポートして使用。

| 関数 | 動き |
|------|------|
| `linear` | 等速（デフォルト） |
| `easeInQuad` | 最初ゆっくり→加速 |
| `easeOutQuad` | 最初速い→減速 |
| `easeInOutQuad` | 両端ゆっくり |
| `easeOutBack` | オーバーシュート付き減速 |

### 使用例

```typescript
import { linear, easeOutQuad } from "../utils/math/easing";

// 右に100px移動する円
new CircleSynthObject(
    100, p.height / 2,
    p.millis(),
    120,
    synthParams,
    50,
    {
        angle: 0,           // 右方向
        distance: 100,      // 100px移動
        angleLFO: false,
        angleLFORate: 0,
        angleLFODepth: 0,
        easing: easeOutQuad // 減速しながら到着
    }
);

// 蛇行しながら下に移動する多角形
new PolygonSynthObject(
    p.width / 2, 100,
    p.millis(),
    120,
    synthParams,
    polygonParams,
    {
        angle: 90,          // 下方向
        distance: 300,
        angleLFO: true,     // 蛇行有効
        angleLFORate: 2,    // 2Hz
        angleLFODepth: 30,  // ±30度
        easing: linear
    }
);
```

---

## CircleSynthObject（円/楕円）

シンプルな円。`aspectRatio`を指定すると楕円になります。

### EllipseParams（オプショナル）

```typescript
interface EllipseParams {
    aspectRatio?: number;  // 幅/高さ比（1.0=正円、>1=横長、<1=縦長）
}
```

### コンストラクタ

```typescript
new CircleSynthObject(
    x: number,               // X座標
    y: number,               // Y座標
    startTime: number,       // 生成時刻（p.millis()）
    bpm: number,             // BPM
    params: SynthParams,     // シンセパラメータ
    baseSize: number,        // 基本サイズ（ピクセル、半径）
    movementParams?: MovementParams,  // 移動パラメータ（オプショナル）
    ellipseParams?: EllipseParams     // 楕円パラメータ（オプショナル）
)
```

### 例：正円

```typescript
new CircleSynthObject(
    p.width / 2,
    p.height / 2,
    p.millis(),
    120,
    synthParams,
    50  // 半径50px
);
```

### 例：横長の楕円

```typescript
new CircleSynthObject(
    p.width / 2,
    p.height / 2,
    p.millis(),
    120,
    synthParams,
    50,
    undefined,  // movementParams不要の場合
    { aspectRatio: 2.0 }  // 幅が高さの2倍
);
```

### 例：移動する縦長の楕円

```typescript
new CircleSynthObject(
    p.width / 2,
    p.height,
    p.millis(),
    120,
    synthParams,
    50,
    {   // 上に移動
        angle: 270,
        distance: 300,
        angleLFO: false,
        angleLFORate: 0,
        angleLFODepth: 0,
    },
    { aspectRatio: 0.5 }  // 縦長（高さが幅の2倍）
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

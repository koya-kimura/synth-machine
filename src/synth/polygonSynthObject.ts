import p5 from "p5";
import type { SynthParams, MovementParams } from "./synthTypes";
import { BaseSynthObject } from "./baseSynthObject";

/**
 * 多角形固有のパラメータ
 */
export interface PolygonParams {
    /** 辺の数（3=三角形, 4=四角形, 5=五角形, ...、デフォルト: 6） */
    sides?: number;
    /** 不規則性（0.0=正多角形, 1.0=完全ランダム、デフォルト: 0） */
    irregularity?: number;
    /** 窪み度（0.0=通常, 1.0=星形、負の値で膨らむ、デフォルト: 0） */
    spikiness?: number;
    /** 頂点ごとのLFOを有効化（デフォルト: false） */
    vertexLFO?: boolean;
    /** 頂点LFOのレート（Hz、デフォルト: 0） */
    vertexLFORate?: number;
    /** 頂点LFOの深度（ピクセル、デフォルト: 0） */
    vertexLFODepth?: number;
}

/**
 * 頂点情報
 */
interface Vertex {
    /** 基本角度（ラジアン） */
    baseAngle: number;
    /** 基本半径（ピクセル） */
    baseRadius: number;
    /** LFO位相オフセット（0～1） */
    lfoPhase: number;
}

/**
 * PolygonSynthObject - 多角形のシンセサイザービジュアルオブジェクト
 * 
 * 正多角形から不規則な多角形、星形まで様々な形状を描画できます。
 * 各頂点に独立したLFOを適用することも可能です。
 */
export class PolygonSynthObject extends BaseSynthObject {
    /** 多角形固有のパラメータ（解決済み） */
    private polygonParams: Required<PolygonParams>;

    /** 頂点情報（インスタンス生成時に計算） */
    private vertices: Vertex[];

    /**
     * PolygonSynthObjectを生成
     * 
     * @param startTime - 生成時刻
     * @param bpm - BPM
     * @param x - X座標
     * @param y - Y座標
     * @param baseSize - 基本サイズ（半径、デフォルト: 50）
     * @param params - シンセサイザーパラメータ（オプショナル）
     * @param polygonParams - 多角形固有のパラメータ（オプショナル）
     * @param movementParams - 移動パラメータ（オプショナル）
     */
    constructor(
        startTime: number,
        bpm: number,
        x: number,
        y: number,
        baseSize: number = 50,
        params: SynthParams = {},
        polygonParams: PolygonParams = {},
        movementParams?: MovementParams
    ) {
        super(startTime, bpm, x, y, baseSize, params, movementParams);

        // デフォルト値を適用
        this.polygonParams = {
            sides: polygonParams.sides ?? 6,
            irregularity: polygonParams.irregularity ?? 0,
            spikiness: polygonParams.spikiness ?? 0,
            vertexLFO: polygonParams.vertexLFO ?? false,
            vertexLFORate: polygonParams.vertexLFORate ?? 0,
            vertexLFODepth: polygonParams.vertexLFODepth ?? 0,
        };

        // 頂点情報を生成
        this.vertices = this.generateVertices();
    }

    /**
     * 多角形を描画
     */
    display(p: p5, tex: p5.Graphics): void {
        this.setupDrawing(tex);

        tex.beginShape();

        for (let i = 0; i < this.vertices.length; i++) {
            const vertex = this.vertices[i];
            const { x, y } = this.calculateVertexPosition(p, vertex);
            tex.vertex(x, y);
        }

        tex.endShape(tex.CLOSE);
        this.finishDrawing(tex);
    }

    /**
     * 頂点情報を生成
     * ランダムシードに基づいて不規則性と位相を決定
     */
    private generateVertices(): Vertex[] {
        const vertices: Vertex[] = [];
        const sides = this.polygonParams.sides;
        const baseAngleStep = (Math.PI * 2) / sides;

        // シード値を使ってランダム生成器を初期化
        const seededRandom = this.createSeededRandom(this.randomSeed);

        for (let i = 0; i < sides; i++) {
            // 基本角度
            let angle = baseAngleStep * i - Math.PI / 2; // 上から開始

            // 不規則性を適用（角度のずれ）
            if (this.polygonParams.irregularity > 0) {
                const angleOffset = (seededRandom() - 0.5) * baseAngleStep * this.polygonParams.irregularity;
                angle += angleOffset;
            }

            // 基本半径
            let radius = this.baseSize;

            // 窪み（星形）を適用
            if (this.polygonParams.spikiness !== 0) {
                // 偶数頂点は内側に窪む
                if (i % 2 === 1) {
                    radius *= (1 - this.polygonParams.spikiness * 0.5);
                }
            }

            // 不規則性を適用（半径のずれ）
            if (this.polygonParams.irregularity > 0) {
                const radiusOffset = (seededRandom() - 0.5) * radius * this.polygonParams.irregularity * 0.5;
                radius += radiusOffset;
            }

            vertices.push({
                baseAngle: angle,
                baseRadius: radius,
                lfoPhase: seededRandom(), // 各頂点に異なるLFO位相
            });
        }

        return vertices;
    }

    /**
     * 頂点の現在位置を計算
     */
    private calculateVertexPosition(p: p5, vertex: Vertex): { x: number; y: number } {
        // ADSRレベルを適用した半径
        let radius = vertex.baseRadius * this.currentLevel;

        // 共通LFOを適用
        radius += this.calculateLFO(p);

        // 頂点ごとのLFOを適用
        if (this.polygonParams.vertexLFO) {
            const vertexLFO = this.calculateVertexLFO(p, vertex.lfoPhase);
            radius += vertexLFO;
        }

        // 極座標から直交座標に変換
        const x = this.x + Math.cos(vertex.baseAngle) * radius;
        const y = this.y + Math.sin(vertex.baseAngle) * radius;

        return { x, y };
    }

    /**
     * 頂点ごとのLFO値を計算
     */
    private calculateVertexLFO(p: p5, phaseOffset: number): number {
        const time = (p.millis() - this.startTime) / 1000;
        return Math.sin((time * this.polygonParams.vertexLFORate + phaseOffset) * Math.PI * 2)
            * this.polygonParams.vertexLFODepth;
    }

    /**
     * シード付き疑似乱数生成器を作成
     * 
     * @param seed - シード値
     * @returns 0～1の範囲の乱数を返す関数
     */
    private createSeededRandom(seed: number): () => number {
        let state = seed;
        return () => {
            state = (state * 1103515245 + 12345) % 2147483648;
            return state / 2147483648;
        };
    }
}

import p5 from "p5";
import type { SynthParams } from "./synthTypes";
import { ADSRPhase, beatsToMs } from "./synthTypes";

/**
 * Autonomous synthesizer visual object
 * Each instance manages its own lifecycle based on ADSR envelope
 */
export class SynthObject {
    private x: number;
    private y: number;
    private startTime: number;
    private bpm: number;
    private params: SynthParams;
    private currentPhase: ADSRPhase;
    private currentLevel: number;
    private baseSize: number;

    // Time parameters converted to milliseconds
    private attackMs: number;
    private decayMs: number;
    private releaseMs: number;
    private noteDurationMs: number;

    constructor(
        x: number,
        y: number,
        startTime: number,
        bpm: number,
        params: SynthParams,
        baseSize: number = 50
    ) {
        this.x = x;
        this.y = y;
        this.startTime = startTime;
        this.bpm = bpm;
        this.params = params;
        this.baseSize = baseSize;
        this.currentPhase = ADSRPhase.ATTACK;
        this.currentLevel = 0;

        // Convert beat-based times to milliseconds
        this.attackMs = beatsToMs(params.attackTime, bpm);
        this.decayMs = beatsToMs(params.decayTime, bpm);
        this.releaseMs = beatsToMs(params.releaseTime, bpm);
        this.noteDurationMs = beatsToMs(params.noteDuration, bpm);
    }

    /**
     * Update the object state based on elapsed time
     */
    update(p: p5): void {
        const elapsedMs = p.millis() - this.startTime;
        const result = this.calculateADSR(elapsedMs);
        this.currentLevel = result.level;
        this.currentPhase = result.phase;
    }

    /**
     * Calculate ADSR envelope based on elapsed time
     */
    private calculateADSR(elapsedMs: number): { level: number; phase: ADSRPhase } {
        // Attack phase
        if (elapsedMs < this.attackMs) {
            const level = p5.prototype.map(elapsedMs, 0, this.attackMs, 0, 1);
            return { level, phase: ADSRPhase.ATTACK };
        }

        // Decay phase
        const decayEndMs = this.attackMs + this.decayMs;
        if (elapsedMs < decayEndMs) {
            const level = p5.prototype.map(
                elapsedMs,
                this.attackMs,
                decayEndMs,
                1,
                this.params.sustainLevel
            );
            return { level, phase: ADSRPhase.DECAY };
        }

        // Sustain phase
        if (elapsedMs < this.noteDurationMs) {
            return { level: this.params.sustainLevel, phase: ADSRPhase.SUSTAIN };
        }

        // Release phase
        const releaseEndMs = this.noteDurationMs + this.releaseMs;
        if (elapsedMs < releaseEndMs) {
            const level = p5.prototype.map(
                elapsedMs,
                this.noteDurationMs,
                releaseEndMs,
                this.params.sustainLevel,
                0
            );
            return { level, phase: ADSRPhase.RELEASE };
        }

        // Dead phase
        return { level: 0, phase: ADSRPhase.DEAD };
    }

    /**
     * Check if the object is dead and should be removed
     */
    isDead(): boolean {
        return this.currentPhase === ADSRPhase.DEAD;
    }

    /**
     * Display the object (simple circle for initial implementation)
     * @param p p5 instance
     * @param tex Graphics context to draw on
     */
    display(p: p5, tex: p5.Graphics): void {
        if (this.currentLevel <= 0) return;

        // Calculate LFO (Low Frequency Oscillator) for subtle movement
        const time = (p.millis() - this.startTime) / 1000;
        const lfoValue = Math.sin(time * this.params.lfoRate * Math.PI * 2) * this.params.lfoDepth;

        // Calculate radius based on ADSR level and LFO
        const radius = this.baseSize * this.currentLevel + lfoValue;

        // Set color mode and apply color with transparency
        tex.push();
        tex.colorMode(tex.HSB);
        const alpha = this.currentLevel * 255;
        tex.fill(
            this.params.colorParams.hue,
            this.params.colorParams.saturation,
            this.params.colorParams.brightness,
            alpha
        );
        tex.noStroke();
        tex.circle(this.x, this.y, radius * 2);
        tex.pop();
    }
}
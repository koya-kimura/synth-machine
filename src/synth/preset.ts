import p5 from "p5";
import { SynthObject } from "./object";
import type { SynthParams } from "./synthTypes";

/**
 * SynthPreset defines a pattern of multiple SynthObjects
 * This acts as a factory to create coordinated groups of objects
 */
export class SynthPreset {
    private name: string;
    private factory: (p: p5, centerX: number, centerY: number, bpm: number, startTime: number) => SynthObject[];

    constructor(
        name: string,
        factory: (p: p5, centerX: number, centerY: number, bpm: number, startTime: number) => SynthObject[]
    ) {
        this.name = name;
        this.factory = factory;
    }

    /**
     * Spawn SynthObjects based on this preset
     */
    spawn(p: p5, centerX: number, centerY: number, bpm: number, startTime: number): SynthObject[] {
        return this.factory(p, centerX, centerY, bpm, startTime);
    }

    getName(): string {
        return this.name;
    }
}

/**
 * Create a preset with 3 circles in a horizontal line
 */
export function createThreeCirclesPreset(): SynthPreset {
    return new SynthPreset("ThreeCircles", (p, centerX, centerY, bpm, startTime) => {
        const spacing = 100; // Distance between circles
        const objects: SynthObject[] = [];

        // Default parameters for all circles
        const baseParams: SynthParams = {
            attackTime: 0.5,
            decayTime: 0.3,
            sustainLevel: 0.6,
            releaseTime: 0.8,
            noteDuration: 2.0,
            waveform: 'sine',
            lfoRate: 2.0,
            lfoDepth: 5,
            colorParams: {
                hue: 180,
                saturation: 80,
                brightness: 100,
            },
        };

        // Left circle
        objects.push(new SynthObject(
            centerX - spacing,
            centerY,
            startTime,
            bpm,
            { ...baseParams, colorParams: { hue: 160, saturation: 80, brightness: 100 } },
            50
        ));

        // Center circle
        objects.push(new SynthObject(
            centerX,
            centerY,
            startTime,
            bpm,
            { ...baseParams, colorParams: { hue: 180, saturation: 80, brightness: 100 } },
            50
        ));

        // Right circle
        objects.push(new SynthObject(
            centerX + spacing,
            centerY,
            startTime,
            bpm,
            { ...baseParams, colorParams: { hue: 200, saturation: 80, brightness: 100 } },
            50
        ));

        return objects;
    });
}

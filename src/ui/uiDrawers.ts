import type { VisualRenderContext } from "../types/render";

export type UIDrawFunction = (context: VisualRenderContext) => void;

export const uiNone: UIDrawFunction = (
  context: VisualRenderContext,
): void => {
  const { tex } = context;
  tex.push();
  tex.pop();
};


export const uiInfo: UIDrawFunction = (
  context: VisualRenderContext,
): void => {
  const { p, tex, visualComposer, font } = context;

  // ビジュアル情報
  const objectCount = visualComposer.getObjectCount();
  const looperInfo = visualComposer.getLooperInfo();

  const margin = tex.width * 0.04;
  const infoX = margin;
  const infoY = margin;
  const lineHeight = Math.min(tex.height, tex.width) * 0.015;

  // 左上：ルーパー情報（シンプルなテキストのみ）
  const infoLines = [
    `Active Objects: ${objectCount}`,
    `Pattern: ${visualComposer.getSelectedPatternName() || "None"}`,
    "",
    "Loopers:",
  ];

  // 各ルーパーの情報を追加（テキストのみ）
  looperInfo.forEach((looper) => {
    const stateName = looper.state === "recording" ? "REC" : looper.state === "playing" ? "PLAY" : "OFF";
    infoLines.push(`  L0${looper.index} : ${stateName} (${looper.eventCount})`);
  });

  tex.push();
  tex.fill(255);
  tex.textSize(Math.min(tex.height, tex.width) * 0.0125);
  tex.textAlign(p.LEFT, p.TOP);
  if (font) {
    tex.textFont(font);
  }

  infoLines.forEach((line, index) => {
    tex.text(line, infoX, infoY + index * lineHeight);
  });
  tex.pop();

  // 右上：オーディオスペクトラム
  tex.push();
  const spectrumHeight = tex.height * 0.1;
  const spectrumWidth = tex.width * 0.35;
  const spectrumX = tex.width - spectrumWidth - margin;
  const spectrumY = margin;

  const audioManager = context.audioManager;
  const frequencyData = audioManager?.getFrequencyData() ?? new Uint8Array(0);

  tex.noFill();
  tex.stroke(80);
  tex.rect(spectrumX, spectrumY, spectrumWidth, spectrumHeight);

  if (frequencyData.length > 0) {
    const barCount = 64;
    const step = Math.max(1, Math.floor(frequencyData.length / barCount));
    const barWidth = spectrumWidth / barCount;

    tex.stroke(255);
    tex.strokeWeight(1);

    for (let i = 0; i < barCount; i++) {
      const startIndex = i * step;
      let sum = 0;
      let count = 0;
      for (let j = 0; j < step && startIndex + j < frequencyData.length; j++) {
        sum += frequencyData[startIndex + j];
        count += 1;
      }
      if (count === 0) {
        continue;
      }
      const level = sum / count / 255;
      const barHeight = spectrumHeight * level;
      const x = spectrumX + i * barWidth;
      tex.line(x, spectrumY + spectrumHeight, x, spectrumY + spectrumHeight - barHeight);
    }
  } else {
    tex.fill(200);
    tex.noStroke();
    tex.textSize(Math.min(tex.height, tex.width) * 0.0125);
    tex.textAlign(p.CENTER, p.CENTER);
    if (font) {
      tex.textFont(font);
    }
    tex.text("Audio inactive", spectrumX + spectrumWidth / 2, spectrumY + spectrumHeight / 2);
  }
  tex.pop();

  // 右下：シンセサイザーパラメータ情報
  tex.push();
  const synthInfoX = margin;
  const synthInfoY = tex.height - margin - 200; // 下から200pxの位置

  // 表示中のオブジェクトからパラメータ情報を取得
  const synthParams = visualComposer.getSynthParameters();

  tex.fill(255);
  tex.textSize(Math.min(tex.height, tex.width) * 0.0125);
  tex.textAlign(p.LEFT, p.TOP);
  if (font) {
    tex.textFont(font);
  }

  const paramLines = [
    "Synth Parameters:",
    "",
  ];

  if (synthParams.length > 0) {
    // 最初のオブジェクトのパラメータを表示（複数ある場合は代表として）
    const params = synthParams[0];
    paramLines.push(`Attack: ${params.attack.toFixed(2)}b`);
    paramLines.push(`Decay: ${params.decay.toFixed(2)}b`);
    paramLines.push(`Sustain: ${params.sustain.toFixed(2)}`);
    paramLines.push(`Release: ${params.release.toFixed(2)}b`);
    paramLines.push(`Frequency: ${params.frequency.toFixed(0)}Hz`);
    paramLines.push(`Amplitude: ${params.amplitude.toFixed(2)}`);

    if (synthParams.length > 1) {
      paramLines.push("");
      paramLines.push(`+ ${synthParams.length - 1} more`);
    }
  }

  paramLines.forEach((line, index) => {
    tex.text(line, synthInfoX, synthInfoY + index * lineHeight);
  });

  tex.pop();
};

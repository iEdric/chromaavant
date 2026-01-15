
import { ColorData, AnalysisResult } from './types';

/**
 * 将RGB转换为HSL
 */
export const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

/**
 * 将RGB转换为十六进制
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

/**
 * 从图像中提取颜色调色板
 */
export const extractColorsFromImage = (imageElement: HTMLImageElement): Promise<AnalysisResult> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // 设置canvas尺寸
      const maxSize = 200;
      const ratio = Math.min(maxSize / imageElement.width, maxSize / imageElement.height);
      canvas.width = imageElement.width * ratio;
      canvas.height = imageElement.height * ratio;

      // 绘制图像
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // 统计颜色出现频率
      const colorMap = new Map<string, number>();

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const alpha = pixels[i + 3];

        // 跳过透明像素
        if (alpha < 128) continue;

        // 降低颜色精度以合并相似颜色
        const step = 20;
        const quantizedR = Math.round(r / step) * step;
        const quantizedG = Math.round(g / step) * step;
        const quantizedB = Math.round(b / step) * step;

        const key = `${quantizedR},${quantizedG},${quantizedB}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // 转换为数组并排序
      const colorEntries = Array.from(colorMap.entries())
        .map(([key, count]) => {
          const [r, g, b] = key.split(',').map(Number);
          return { rgb: [r, g, b] as [number, number, number], count };
        })
        .sort((a, b) => b.count - a.count);

      // 取前5个主要颜色
      const totalPixels = colorEntries.reduce((sum, entry) => sum + entry.count, 0);
      const topColors: ColorData[] = colorEntries.slice(0, 5).map(entry => {
        const [r, g, b] = entry.rgb;
        const hsl = rgbToHsl(r, g, b);
        return {
          hex: rgbToHex(r, g, b),
          rgb: entry.rgb,
          hsl,
          percentage: Math.round((entry.count / totalPixels) * 100)
        };
      });

      // 分析颜色和谐度
      const dominantColor = topColors[0]?.hex || '#000000';
      const harmony = analyzeColorHarmony(topColors);

      // 生成对比色建议
      const contrastSuggestion = generateContrastSuggestion(topColors);

      resolve({
        palette: topColors,
        dominantColor,
        colorHarmony: harmony,
        contrastSuggestion
      });

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 分析颜色和谐度
 */
const analyzeColorHarmony = (colors: ColorData[]): string => {
  if (colors.length < 2) return 'Monochromatic';

  const hues = colors.map(c => c.hsl[0]).sort((a, b) => a - b);

  // 检查是否是互补色
  const hueDiff = Math.abs(hues[0] - hues[hues.length - 1]);
  if (hueDiff >= 150 && hueDiff <= 210) {
    return 'Complementary';
  }

  // 检查是否是类似色
  const hueRange = hues[hues.length - 1] - hues[0];
  if (hueRange <= 60) {
    return 'Analogous';
  }

  // 检查是否是三元色
  if (hueRange >= 100 && hueRange <= 140) {
    return 'Triadic';
  }

  return 'Mixed Harmony';
};

/**
 * 生成对比色建议
 */
const generateContrastSuggestion = (colors: ColorData[]): string => {
  if (colors.length === 0) return '#FFFFFF';

  const dominantHsl = colors[0].hsl;
  const [h, s, l] = dominantHsl;

  // 如果主色是暗色，建议亮色；反之亦然
  if (l < 50) {
    return rgbToHex(255, 255, 255); // 白色
  } else {
    return rgbToHex(0, 0, 0); // 黑色
  }
};


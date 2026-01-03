import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  onReset: () => void;
  t: (key: string) => string;
}

const PRESET_COLORS = [
  // Row 1 - Reds & Pinks
  '#EF4444', '#F87171', '#FB7185', '#EC4899', '#F472B6', '#E879F9',
  // Row 2 - Purples & Blues
  '#A855F7', '#8B5CF6', '#6366F1', '#3B82F6', '#60A5FA', '#38BDF8',
  // Row 3 - Cyans & Greens
  '#06B6D4', '#14B8A6', '#10B981', '#22C55E', '#84CC16', '#A3E635',
  // Row 4 - Yellows & Oranges
  '#FACC15', '#FDE047', '#FCD34D', '#FBBF24', '#F59E0B', '#F97316',
  // Row 5 - Neutrals
  '#78716C', '#A8A29E', '#D6D3D1', '#0F172A', '#334155', '#64748B',
];

export const ColorPicker = ({
  isOpen,
  onClose,
  currentColor,
  onColorChange,
  onReset,
  t,
}: ColorPickerProps) => {
  const [hue, setHue] = useState(210);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [customColor, setCustomColor] = useState(currentColor);

  useEffect(() => {
    // Parse current color to HSL if it's a hex
    if (currentColor.startsWith('#')) {
      const rgb = hexToRgb(currentColor);
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
      }
    }
  }, [currentColor]);

  useEffect(() => {
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    setCustomColor(hslToHex(hue, saturation, lightness));
  }, [hue, saturation, lightness]);

  const handlePresetClick = (color: string) => {
    onColorChange(color);
    const rgb = hexToRgb(color);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
    }
  };

  const handleApply = () => {
    onColorChange(customColor);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Popup - ergonomisch mittig, mit Safe-Area & Bottom-Nav Abstand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+6.5rem)]"
          >
            <div className="glass-card p-6 rounded-3xl w-full max-w-[360px] max-h-full overflow-y-auto overscroll-contain">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-foreground">{t('colorsAccents')}</h3>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-xl bg-muted/50"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              {/* Preview */}
              <div 
                className="w-full h-16 rounded-2xl mb-5 transition-colors duration-200"
                style={{ backgroundColor: customColor }}
              />

              {/* Color Grid */}
              <div className="grid grid-cols-6 gap-2 mb-5">
                {PRESET_COLORS.map((color) => (
                  <motion.button
                    key={color}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePresetClick(color)}
                    className={cn(
                      "w-10 h-10 rounded-xl transition-all relative",
                      currentColor === color && "ring-2 ring-offset-2 ring-foreground"
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {currentColor === color && (
                      <Check className="w-4 h-4 absolute inset-0 m-auto text-white drop-shadow" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Slider Container - mehr Innenabstand, damit der Thumb nie am Rand klebt */}
              <div className="space-y-5 px-4">
                {/* Hue Slider */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-3 block">
                    {t('hue')}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hue}
                    onChange={(e) => setHue(Number(e.target.value))}
                    className="w-full h-5 rounded-full appearance-none cursor-pointer touch-none"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(0, 100%, 50%), 
                        hsl(60, 100%, 50%), 
                        hsl(120, 100%, 50%), 
                        hsl(180, 100%, 50%), 
                        hsl(240, 100%, 50%), 
                        hsl(300, 100%, 50%), 
                        hsl(360, 100%, 50%)
                      )`,
                    }}
                  />
                </div>

                {/* Saturation Slider */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-3 block">
                    {t('saturation')}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full h-5 rounded-full appearance-none cursor-pointer touch-none"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(${hue}, 0%, ${lightness}%), 
                        hsl(${hue}, 100%, ${lightness}%)
                      )`,
                    }}
                  />
                </div>

                {/* Lightness Slider */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-3 block">
                    {t('lightness')}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={lightness}
                    onChange={(e) => setLightness(Number(e.target.value))}
                    className="w-full h-5 rounded-full appearance-none cursor-pointer touch-none"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(${hue}, ${saturation}%, 10%), 
                        hsl(${hue}, ${saturation}%, 50%),
                        hsl(${hue}, ${saturation}%, 90%)
                      )`,
                    }}
                  />
                </div>
              </div>

              <div className="h-5" />

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onReset}
                  className="glass-button-secondary px-4"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t('reset')}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApply}
                  className="glass-button-primary flex-1"
                >
                  {t('apply')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Helper functions
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

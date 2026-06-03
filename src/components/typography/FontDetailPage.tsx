import { useState } from 'react';
import { ChevronLeft, ExternalLink, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const WEIGHT_NAMES: Record<number, string> = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
};

const DEFAULT_TEXT: Record<'latin' | 'thai', string> = {
  latin: 'Almost before we knew it, we had left the ground.',
  thai: 'เส้นทางแห่งความสำเร็จเริ่มต้นจากการออกแบบที่ดี',
};

const STYLE_SPECIMEN: Record<'latin' | 'thai', string> = {
  latin: 'Whereas disregard and contempt for human rights have resulted in barbarous acts which have outraged the conscience of mankind',
  thai: 'ตัวอักษรที่ดีสร้างประสบการณ์การอ่านที่น่าพึงพอใจ และสื่อสารได้อย่างมีประสิทธิภาพสำหรับทุกคน',
};

const THAI_CONSONANTS = 'ก ข ค ฆ ง จ ฉ ช ซ ฌ ญ ฎ ฏ ฐ ฑ ฒ ณ ด ต ถ ท ธ น บ ป ผ ฝ พ ฟ ภ ม ย ร ล ว ศ ษ ส ห ฬ อ ฮ';
const THAI_VOWELS_TONES = 'า ิ ี ึ ื ุ ู เ แ โ ใ ไ ็ ่ ้ ๊ ๋ ์ ๆ ฯ ๐ ๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙';

interface FontDetailPageProps {
  family: string;
  weights: number[];
  onBack: () => void;
}

export function FontDetailPage({ family, weights, onBack }: FontDetailPageProps) {
  const [testerScript, setTesterScript] = useState<'latin' | 'thai'>('latin');
  const [styleScript, setStyleScript] = useState<'latin' | 'thai'>('latin');
  const [testerSize, setTesterSize] = useState(64);
  const [testerWeight, setTesterWeight] = useState(weights.includes(400) ? 400 : weights[0] ?? 400);
  const [resetKey, setResetKey] = useState(0);

  const fontStyle = { fontFamily: `'${family}', sans-serif` };
  const sortedWeights = [...weights].sort((a, b) => a - b);
  const googleFontsUrl = `https://fonts.google.com/specimen/${encodeURIComponent(family).replace(/%20/g, '+')}`;

  function switchScript(script: 'latin' | 'thai') {
    setTesterScript(script);
    setResetKey((k) => k + 1);
  }

  function handleReset() {
    setResetKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-card shrink-0">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 -ml-2 h-8">
          <ChevronLeft className="size-4" />
          All fonts
        </Button>
        <div className="w-px h-4 bg-border" />
        <h1 className="text-base font-semibold leading-none" style={fontStyle}>
          {family}
        </h1>
        <div className="flex gap-1 ml-1">
          {sortedWeights.map((w) => (
            <span
              key={w}
              className="text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded leading-none"
            >
              {w}
            </span>
          ))}
        </div>
        <div className="flex-1" />
        <a
          href={googleFontsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="size-3" />
          Google Fonts
        </a>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* ── Type Tester ── */}
        <section className="border-b border-border">
          <div className="flex items-center flex-wrap gap-3 px-6 pt-5 pb-3">
            <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mr-auto">
              Type Tester
            </h2>

            {/* Script toggle */}
            <div className="flex rounded-md border border-border overflow-hidden text-xs h-7">
              <button
                className={cn(
                  'px-3 transition-colors',
                  testerScript === 'latin'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground',
                )}
                onClick={() => switchScript('latin')}
              >
                Latin
              </button>
              <button
                className={cn(
                  'px-3 border-l border-border transition-colors',
                  testerScript === 'thai'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground',
                )}
                onClick={() => switchScript('thai')}
              >
                ไทย
              </button>
            </div>

            {/* Size slider */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={8}
                max={200}
                value={testerSize}
                onChange={(e) => setTesterSize(Number(e.target.value))}
                className="w-28 accent-primary"
              />
              <span className="text-xs font-mono text-muted-foreground tabular-nums w-10">
                {testerSize}px
              </span>
            </div>

            {/* Weight select */}
            <select
              value={testerWeight}
              onChange={(e) => setTesterWeight(Number(e.target.value))}
              className="text-xs border border-border rounded px-2 h-7 bg-background"
            >
              {sortedWeights.map((w) => (
                <option key={w} value={w}>
                  {w} {WEIGHT_NAMES[w] ?? ''}
                </option>
              ))}
            </select>

            <button
              onClick={handleReset}
              title="Reset to default text"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>

          {/* Editable specimen — key forces remount on script switch or reset */}
          <div
            key={`${testerScript}-${resetKey}`}
            contentEditable
            suppressContentEditableWarning
            className="px-6 pb-8 outline-none min-h-[80px] cursor-text caret-primary"
            style={{
              ...fontStyle,
              fontSize: testerSize,
              fontWeight: testerWeight,
              lineHeight: 1.2,
            }}
          >
            {DEFAULT_TEXT[testerScript]}
          </div>
        </section>

        {/* ── Styles ── */}
        <section className="border-b border-border">
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {sortedWeights.length} {sortedWeights.length === 1 ? 'Style' : 'Styles'}
            </h2>
            <div className="flex rounded-md border border-border overflow-hidden text-xs h-7">
              <button
                className={cn(
                  'px-3 transition-colors',
                  styleScript === 'latin'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground',
                )}
                onClick={() => setStyleScript('latin')}
              >
                Latin
              </button>
              <button
                className={cn(
                  'px-3 border-l border-border transition-colors',
                  styleScript === 'thai'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground',
                )}
                onClick={() => setStyleScript('thai')}
              >
                ไทย
              </button>
            </div>
          </div>

          <div className="divide-y divide-border">
            {sortedWeights.map((w) => (
              <div key={w} className="px-6 py-5 group">
                <p className="text-[11px] text-muted-foreground mb-2 font-mono">
                  {w} — {WEIGHT_NAMES[w] ?? 'Custom'}
                </p>
                <p
                  className="text-[26px] leading-snug text-foreground"
                  style={{ ...fontStyle, fontWeight: w }}
                >
                  {STYLE_SPECIMEN[styleScript]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Glyph sampler: Latin ── */}
        <section className="border-b border-border px-6 py-6">
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Latin Glyphs
          </h2>
          <p className="text-lg leading-loose text-foreground" style={fontStyle}>
            A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
          </p>
          <p className="text-lg leading-loose text-foreground" style={fontStyle}>
            a b c d e f g h i j k l m n o p q r s t u v w x y z
          </p>
          <p className="text-lg leading-loose text-muted-foreground" style={fontStyle}>
            0 1 2 3 4 5 6 7 8 9 ! @ # $ % & * ( ) + = ? / . , ; :
          </p>
        </section>

        {/* ── Glyph sampler: Thai ── */}
        <section className="px-6 py-6">
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Thai Glyphs
          </h2>
          <p className="text-lg leading-[2.8] text-foreground" style={fontStyle}>
            {THAI_CONSONANTS}
          </p>
          <p className="text-lg leading-[2.8] text-muted-foreground" style={fontStyle}>
            {THAI_VOWELS_TONES}
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-2xl leading-relaxed text-foreground" style={fontStyle}>
              สวัสดีชาวโลก — Hello World
            </p>
            <p className="text-base leading-relaxed text-muted-foreground" style={fontStyle}>
              การออกแบบที่ดีเริ่มต้นจากการเข้าใจผู้ใช้งาน
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground" style={fontStyle}>
              ตัวอักษรที่ดีไม่เพียงแต่สวยงาม แต่ยังต้องอ่านง่ายและสื่อสารได้อย่างชัดเจน
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

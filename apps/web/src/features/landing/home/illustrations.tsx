import { PaintableSvg } from "@/features/landing/home/paintable-svg";

const RED = "#EB4F53";
const MUSTARD = "#F5AC22";
const MINT = "#A4CDBB";
const LILAC = "#E7D8F2";
const SAND = "#F2DDB4";

/** Filtro de trazo a mano compartido por todos los dibujos de la home. */
export function SketchFilter() {
  return (
    <svg className="home-defs" aria-hidden="true" focusable="false">
      <filter id="home-sketch" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.03"
          numOctaves={2}
          seed={4}
        />
        <feDisplacementMap in="SourceGraphic" scale={3} />
      </filter>
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <PaintableSvg
      width={120}
      height={100}
      className="home-step__icon"
      paint={
        <>
          <path fill={RED} d="M22 24 L100 22 L101 40 L21 42 Z" />
          <circle fill={MUSTARD} cx="74" cy="66" r="11" />
        </>
      }
      lines={
        <>
          <path d="M20 24 L100 21 L102 88 L18 90 Z M20 41 L101 39" />
          <path d="M40 13 L40 29 M80 12 L80 28" />
          <path d="M34 56 L42 56 M52 56 L60 56 M34 70 L42 70 M52 70 L60 70 M34 80 L42 80" />
          <path d="M62 66 Q63 53 75 54 Q87 56 86 67 Q84 79 72 78 Q62 76 63 64" />
        </>
      }
    />
  );
}

export function FormIcon() {
  return (
    <PaintableSvg
      width={120}
      height={100}
      className="home-step__icon"
      paint={
        <>
          <path fill={MINT} d="M26 16 L84 13 L88 87 L29 90 Z" />
          <path fill={MUSTARD} d="M72 80 L101 41 L108 47 L79 86 Z" />
        </>
      }
      lines={
        <>
          <path d="M25 15 L85 12 L90 88 L28 92 Z" />
          <path d="M38 35 L74 33 M38 50 L77 48 M38 65 L62 64" />
          <path d="M70 81 L100 40 L109 47 L79 88 L68 92 Z M96 45 L105 52" />
        </>
      }
    />
  );
}

export function EnvelopeIcon() {
  return (
    <PaintableSvg
      width={120}
      height={100}
      className="home-step__icon"
      paint={
        <>
          <path fill={MINT} d="M16 31 L104 29 L105 84 L15 85 Z" />
          <path
            fill={RED}
            d="M60 78 Q44 66 50 58 Q55 52 60 59 Q65 52 70 58 Q76 66 60 78 Z"
          />
        </>
      }
      lines={
        <>
          <path d="M15 30 L105 28 L106 85 L14 86 Z" />
          <path d="M15 30 L60 60 L105 28" />
          <path d="M60 78 Q44 66 50 58 Q55 52 60 59 Q65 52 70 58 Q76 66 60 78 Z" />
        </>
      }
    />
  );
}

/** La consulta: sillón, mesita con pinceles, planta y un arcoíris en la pared. */
export function StudioScene({
  className = "home-scene",
  mode = "scroll",
}: {
  className?: string;
  mode?: "scroll" | "mount";
}) {
  return (
    <PaintableSvg
      width={600}
      height={380}
      rows={9}
      className={className}
      mode={mode}
      label="Dibujo de la consulta: un sillón, una mesita con pinceles, una planta y un arcoíris en la pared"
      paint={
        <>
          <path fill={LILAC} d="M50 338 Q300 300 560 338 Q300 372 50 338 Z" />
          <path
            fill={MUSTARD}
            d="M155 200 L155 108 Q155 76 192 74 L268 72 Q302 72 302 106 L302 200 Z"
          />
          <path
            fill={MUSTARD}
            d="M124 222 L124 162 Q124 144 141 144 Q156 144 156 162 L156 222 Z M302 222 L302 162 Q302 144 319 144 Q336 144 336 162 L336 222 Z"
          />
          <path
            fill={MUSTARD}
            d="M132 226 L332 226 L332 262 Q332 270 320 270 L144 270 Q132 270 132 262 Z"
          />
          <path
            fill={RED}
            d="M200 112 Q196 98 210 96 L254 94 Q268 96 264 110 L260 148 Q256 158 244 158 L214 158 Q202 156 202 146 Z"
          />
          <path
            fill={RED}
            d="M402 222 L400 182 Q400 175 407 175 L439 175 Q446 175 444 182 L442 222 Z"
          />
          <circle fill={MINT} cx="402" cy="118" r="6" />
          <circle fill={MUSTARD} cx="428" cy="108" r="6" />
          <circle fill={RED} cx="455" cy="122" r="6" />
          <path
            fill={MINT}
            d="M534 258 Q500 222 498 186 Q526 214 534 258 Z M536 258 Q540 204 562 176 Q560 220 536 258 Z M534 260 Q512 236 486 234 Q514 230 534 260 Z M538 260 Q560 232 586 228 Q566 252 538 260 Z"
          />
          <path fill={RED} d="M506 262 L564 262 L556 320 L516 320 Z" />
          <path
            fill="none"
            stroke={RED}
            strokeWidth={11}
            d="M386 128 Q386 80 428 78 Q470 80 470 128"
          />
          <path
            fill="none"
            stroke={MUSTARD}
            strokeWidth={11}
            d="M398 128 Q398 92 428 90 Q458 92 458 128"
          />
          <path
            fill="none"
            stroke={MINT}
            strokeWidth={11}
            d="M410 128 Q410 104 428 102 Q446 104 446 128"
          />
        </>
      }
      lines={
        <>
          <path d="M20 342 Q300 330 580 344" />
          <path d="M50 338 Q300 300 560 338 Q300 372 50 338" />
          <path d="M152 200 L152 106 Q152 72 190 70 L270 68 Q306 68 306 104 L306 200" />
          <path d="M120 222 L120 162 Q120 140 140 140 Q160 140 160 162 L160 222 Z M298 222 L298 162 Q298 140 318 140 Q340 140 340 162 L340 222 Z" />
          <path d="M130 222 L334 222 L334 262 Q334 272 320 272 L144 272 Q130 272 130 262 Z M160 205 L298 205" />
          <path d="M146 272 L136 326 M318 272 L328 326" />
          <path d="M198 110 Q194 94 208 92 L254 90 Q270 92 266 108 L262 148 Q258 160 244 160 L212 160 Q200 158 200 148 Z" />
          <path d="M368 224 Q422 210 478 224 Q422 238 368 224 Z M422 232 L422 320 M394 324 Q422 314 452 324" />
          <path d="M402 222 L400 180 Q400 172 408 172 L438 172 Q446 172 444 180 L442 222" />
          <path d="M410 172 L402 124 M426 172 L428 114 M438 172 L454 128" />
          <path d="M360 40 L500 46 L496 150 L356 145 Z" />
          <path d="M504 260 L566 260 L556 322 L516 322 Z" />
          <path d="M534 258 Q500 222 498 186 Q526 214 534 258 M536 258 Q540 204 562 176 Q560 220 536 258 M534 260 Q512 236 486 234 Q514 230 534 260 M538 260 Q560 232 586 228 Q566 252 538 260" />
        </>
      }
    />
  );
}

/** El mar de Iquique con el sol y el cerro. */
export function SeaScene() {
  return (
    <PaintableSvg
      width={600}
      height={220}
      rows={6}
      className="home-sea"
      label="Dibujo del mar de Iquique con el sol y el cerro"
      paint={
        <>
          <circle fill={MUSTARD} cx="470" cy="62" r="34" />
          <path
            fill={SAND}
            d="M0 150 Q110 70 220 120 Q290 96 350 140 Q340 176 270 192 Q140 214 0 196 Z"
          />
          <path
            fill={MINT}
            d="M250 160 Q280 146 310 160 T370 160 T430 160 T490 160 T550 160 T600 158 Q596 196 560 204 Q470 214 380 206 Q290 210 262 196 Q244 180 250 160 Z"
          />
        </>
      }
      lines={
        <>
          <path d="M436 62 Q436 30 470 28 Q504 30 504 62 Q502 94 470 96 Q438 94 436 62" />
          <path d="M470 12 L470 0 M520 24 L530 16 M534 62 L548 62 M420 24 L410 16 M406 62 L392 62" />
          <path d="M0 150 Q110 70 220 120 Q290 96 350 140" />
          <path d="M250 160 Q280 146 310 160 T370 160 T430 160 T490 160 T550 160 T600 158" />
          <path d="M290 186 Q310 176 330 186 M400 196 Q420 186 440 196 M500 182 Q520 172 540 182" />
          <path d="M60 196 L74 196 M120 184 L136 184 M180 200 L190 200" />
        </>
      }
    />
  );
}

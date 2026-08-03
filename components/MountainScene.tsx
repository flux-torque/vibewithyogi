/**
 * Layered mountain backdrop.
 *
 * Ridges are ordered far -> near. Atmospheric perspective is faked by
 * lightening + desaturating the distant ranges toward the sky colour, so depth
 * reads correctly without any 3D work.
 */
export default function MountainScene() {
  return (
    <svg
      className="scene-mountains absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f6ea3" />
          <stop offset="34%" stopColor="#6ba6d2" />
          <stop offset="62%" stopColor="#a9cfe8" />
          <stop offset="82%" stopColor="#dceaf2" />
          <stop offset="100%" stopColor="#f6e9dc" />
        </linearGradient>

        <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff6e0" stopOpacity="0.95" />
          <stop offset="38%" stopColor="#ffe9bd" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#ffe9bd" stopOpacity="0" />
        </radialGradient>

        {/* Each ridge gets a vertical gradient so its base sinks into the haze
            of the ridge behind it. */}
        <linearGradient id="ridge4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9c4d9" />
          <stop offset="100%" stopColor="#c8dbe8" />
        </linearGradient>
        <linearGradient id="ridge3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c9fbe" />
          <stop offset="100%" stopColor="#9dbcd3" />
        </linearGradient>
        <linearGradient id="ridge2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f7a9c" />
          <stop offset="100%" stopColor="#6c90ae" />
        </linearGradient>
        <linearGradient id="ridge1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e4a67" />
          <stop offset="100%" stopColor="#456b8a" />
        </linearGradient>
        <linearGradient id="ridge0" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2f44" />
          <stop offset="100%" stopColor="#2a4258" />
        </linearGradient>

        {/* Horizontal mist band that pools in the valleys between ridges. */}
        <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#sky)" />
      <circle cx="1015" cy="300" r="360" fill="url(#sunGlow)" />
      <circle cx="1015" cy="300" r="44" fill="#fffdf4" opacity="0.9" />

      {/* --- ridge 4 : farthest, palest --- */}
      <path
        fill="url(#ridge4)"
        d="M0 512 L118 424 L196 468 L302 372 L420 466 L521 424 L642 344 L764 448 L884 396 L1004 458 L1122 384 L1258 448 L1361 406 L1440 452 L1440 900 L0 900 Z"
      />
      {/* snow on the two highest far peaks */}
      <path fill="#ffffff" opacity="0.75" d="M642 344 L676 373 L658 369 L642 379 L626 368 L608 372 Z" />
      <path fill="#ffffff" opacity="0.7" d="M302 372 L332 398 L316 394 L302 403 L287 393 L272 397 Z" />

      <rect x="0" y="430" width="1440" height="120" fill="url(#mist)" opacity="0.5" />

      {/* --- ridge 3 --- */}
      <path
        fill="url(#ridge3)"
        d="M0 618 L162 518 L281 570 L402 466 L560 578 L702 496 L822 558 L962 456 L1102 548 L1242 498 L1360 558 L1440 516 L1440 900 L0 900 Z"
      />
      <path fill="#ffffff" opacity="0.6" d="M962 456 L995 487 L977 482 L960 493 L944 481 L928 486 Z" />
      <path fill="#ffffff" opacity="0.55" d="M402 466 L433 496 L416 491 L400 502 L384 490 L369 495 Z" />

      <rect x="0" y="540" width="1440" height="130" fill="url(#mist)" opacity="0.45" />

      {/* --- ridge 2 --- */}
      <path
        fill="url(#ridge2)"
        d="M0 716 L108 646 L214 694 L352 590 L466 676 L598 618 L706 682 L852 596 L988 674 L1096 634 L1238 690 L1344 628 L1440 668 L1440 900 L0 900 Z"
      />

      <rect x="0" y="640" width="1440" height="140" fill="url(#mist)" opacity="0.38" />

      {/* --- ridge 1 --- */}
      <path
        fill="url(#ridge1)"
        d="M0 790 L154 712 L306 776 L470 686 L648 780 L818 704 L1010 782 L1176 700 L1320 784 L1440 742 L1440 900 L0 900 Z"
      />

      {/* --- ridge 0 : nearest foreground, soft rolling hills --- */}
      <path
        fill="url(#ridge0)"
        d="M0 852 Q180 806 360 838 Q540 870 720 830 Q900 790 1080 828 Q1260 866 1440 822 L1440 900 L0 900 Z"
      />
    </svg>
  );
}

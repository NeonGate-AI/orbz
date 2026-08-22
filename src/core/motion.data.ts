import type { OrbzState } from './appearance.types'
import type { OrbzMotionProfile } from './motion.types'

const repeat = Number.POSITIVE_INFINITY

export const ORBZ_APPEARANCE_BY_STATE = Object.freeze({
  idle: Object.freeze({ contrast: 1.48, saturation: 1.28 }),
  listening: Object.freeze({ contrast: 1.52, saturation: 1.4 }),
  thinking: Object.freeze({ contrast: 1.6, saturation: 1.42 }),
  speaking: Object.freeze({ contrast: 1.58, saturation: 1.5 }),
  asleep: Object.freeze({ contrast: 1.22, saturation: 0.72 })
} satisfies Record<
  OrbzState,
  Pick<OrbzMotionProfile, 'contrast' | 'saturation'>
>)

export const ORBZ_MOTION_BY_STATE: Record<OrbzState, OrbzMotionProfile> = {
  idle: {
    ...ORBZ_APPEARANCE_BY_STATE.idle,
    aura: {
      animate: { opacity: [0.34, 0.48, 0.34], scale: [0.98, 1.04, 0.98] },
      transition: { duration: 6, ease: 'easeInOut', repeat },
    },
    core: {
      animate: { opacity: [0.08, 0.17, 0.08], scale: [0.94, 1.04, 0.94] },
      transition: { duration: 5.2, ease: 'easeInOut', repeat },
    },
    field: {
      animate: { '--orb-angle': ['0deg', '360deg'] },
      transition: { duration: 20, ease: 'linear', repeat },
    },
    highlight: {
      animate: {
        scale: [1.04, 1.1],
        x: ['-4%', '5%'],
        y: ['-3%', '4%'],
      },
      transition: {
        duration: 11,
        ease: 'easeInOut',
        repeat,
        repeatType: 'reverse',
      },
    },
    ring: {
      animate: { opacity: [0.04, 0.13, 0.04], scale: [0.98, 1.06, 0.98] },
      transition: { duration: 6, ease: 'easeInOut', repeat },
    },
    root: {
      animate: { opacity: 1, rotate: 0, scale: [1, 1.025, 1], y: 0 },
      transition: { duration: 6, ease: 'easeInOut', repeat },
    },
  },
  listening: {
    ...ORBZ_APPEARANCE_BY_STATE.listening,
    aura: {
      animate: { opacity: [0.4, 0.66, 0.4], scale: [0.96, 1.1, 0.96] },
      transition: { duration: 2.4, ease: 'easeInOut', repeat },
    },
    core: {
      animate: { opacity: [0.12, 0.28, 0.12], scale: [0.88, 1.08, 0.88] },
      transition: { duration: 1.7, ease: 'easeOut', repeat },
    },
    field: {
      animate: { '--orb-angle': ['0deg', '360deg'] },
      transition: { duration: 11, ease: 'linear', repeat },
    },
    highlight: {
      animate: {
        scale: [1.03, 1.12, 1.03],
        x: ['-2%', '2%', '-2%'],
        y: ['-1%', '1%', '-1%'],
      },
      transition: { duration: 4, ease: 'easeInOut', repeat },
    },
    ring: {
      animate: { opacity: [0, 0.48, 0], scale: [0.86, 1.23, 1.23] },
      transition: {
        duration: 1.7,
        ease: 'easeOut',
        repeat,
        times: [0, 0.58, 1],
      },
    },
    root: {
      animate: {
        opacity: 1,
        rotate: 0,
        scale: [1, 1.045, 1.012, 1.04, 1],
        y: [0, -1, 0],
      },
      transition: { duration: 2.4, ease: 'easeInOut', repeat },
    },
  },
  thinking: {
    ...ORBZ_APPEARANCE_BY_STATE.thinking,
    aura: {
      animate: {
        opacity: [0.38, 0.58, 0.44, 0.38],
        scale: [1, 1.08, 0.99, 1],
      },
      transition: { duration: 3.8, ease: 'easeInOut', repeat },
    },
    core: {
      animate: {
        opacity: [0.12, 0.34, 0.18, 0.3, 0.12],
        scale: [0.84, 1.06, 0.92, 1.02, 0.84],
        x: ['-8%', '12%', '-4%', '-8%'],
        y: ['-6%', '5%', '12%', '-6%'],
      },
      transition: { duration: 4.6, ease: 'easeInOut', repeat },
    },
    field: {
      animate: { '--orb-angle': ['0deg', '720deg'] },
      transition: { duration: 8, ease: 'linear', repeat },
    },
    highlight: {
      animate: {
        rotate: [0, -5, 4, 0],
        scale: [1.05, 1.13, 1.07, 1.05],
        x: ['-6%', '7%', '-3%', '-6%'],
        y: ['-5%', '3%', '7%', '-5%'],
      },
      transition: { duration: 5.2, ease: 'easeInOut', repeat },
    },
    ring: {
      animate: {
        opacity: [0.08, 0.28, 0.12, 0.24, 0.08],
        rotate: [0, 120, 250, 360],
        scale: [0.94, 1.08, 0.97, 1.05, 0.94],
      },
      transition: { duration: 4.2, ease: 'easeInOut', repeat },
    },
    root: {
      animate: {
        opacity: 1,
        rotate: [0, -1.4, 1.2, 0],
        scale: [1, 1.018, 0.995, 1.02, 1],
        y: [0, -1, 1, 0],
      },
      transition: { duration: 3.2, ease: 'easeInOut', repeat },
    },
  },
  speaking: {
    ...ORBZ_APPEARANCE_BY_STATE.speaking,
    aura: {
      animate: {
        opacity: [0.42, 0.72, 0.46, 0.66, 0.42],
        scale: [0.98, 1.1, 1.01, 1.08, 0.98],
      },
      transition: {
        duration: 1.65,
        ease: 'easeInOut',
        repeat,
        times: [0, 0.22, 0.48, 0.72, 1],
      },
    },
    core: {
      animate: {
        opacity: [0.18, 0.42, 0.14, 0.36, 0.18],
        scale: [0.86, 1.14, 0.94, 1.08, 0.86],
      },
      transition: {
        duration: 1.35,
        ease: 'easeInOut',
        repeat,
        times: [0, 0.2, 0.5, 0.7, 1],
      },
    },
    field: {
      animate: { '--orb-angle': ['0deg', '540deg'] },
      transition: { duration: 5.5, ease: 'linear', repeat },
    },
    highlight: {
      animate: {
        scale: [1.02, 1.16, 1.04, 1.12, 1.02],
        x: ['-3%', '4%', '-1%', '3%', '-3%'],
        y: ['-2%', '2%', '-1%', '3%', '-2%'],
      },
      transition: { duration: 1.65, ease: 'easeInOut', repeat },
    },
    ring: {
      animate: {
        opacity: [0.08, 0.4, 0.04, 0.3, 0],
        scale: [0.98, 1.14, 1.04, 1.2, 1.2],
      },
      transition: {
        duration: 1.35,
        ease: 'easeOut',
        repeat,
        times: [0, 0.2, 0.48, 0.7, 1],
      },
    },
    root: {
      animate: {
        opacity: 1,
        rotate: 0,
        scale: [1, 1.06, 0.99, 1.045, 1.01, 1.055, 1],
        y: [0, -1, 0, -1, 0, -1, 0],
      },
      transition: {
        duration: 1.65,
        ease: 'easeInOut',
        repeat,
        times: [0, 0.18, 0.36, 0.56, 0.7, 0.86, 1],
      },
    },
  },
  asleep: {
    ...ORBZ_APPEARANCE_BY_STATE.asleep,
    aura: {
      animate: { opacity: [0.12, 0.2, 0.12], scale: [0.94, 0.98, 0.94] },
      transition: { duration: 9, ease: 'easeInOut', repeat },
    },
    core: {
      animate: { opacity: [0.02, 0.05, 0.02], scale: [0.9, 0.94, 0.9] },
      transition: { duration: 9, ease: 'easeInOut', repeat },
    },
    field: {
      animate: { '--orb-angle': ['0deg', '18deg'] },
      transition: {
        duration: 16,
        ease: 'easeInOut',
        repeat,
        repeatType: 'reverse',
      },
    },
    highlight: {
      animate: {
        opacity: [0.22, 0.32, 0.22],
        scale: [1, 1.025, 1],
        y: ['2%', '0%', '2%'],
      },
      transition: { duration: 9, ease: 'easeInOut', repeat },
    },
    ring: {
      animate: { opacity: 0.015, rotate: 0, scale: 0.94 },
      transition: { duration: 0 },
    },
    root: {
      animate: {
        opacity: [0.68, 0.78, 0.68],
        rotate: 0,
        scale: [0.97, 0.985, 0.97],
        y: [2, 0, 2],
      },
      transition: { duration: 9, ease: 'easeInOut', repeat },
    },
  },
}

export const REDUCED_ORBZ_MOTION_BY_STATE: Record<
  OrbzState,
  OrbzMotionProfile
> = {
  idle: {
    ...ORBZ_APPEARANCE_BY_STATE.idle,
    aura: { animate: { opacity: 0.34, scale: 1 }, transition: { duration: 0 } },
    core: {
      animate: { opacity: 0.08, scale: 0.94 },
      transition: { duration: 0 },
    },
    field: {
      animate: { '--orb-angle': '0deg' },
      transition: { duration: 0 },
    },
    highlight: {
      animate: { opacity: 1, scale: 1.04, x: '-4%', y: '-3%' },
      transition: { duration: 0 },
    },
    ring: {
      animate: { opacity: 0.04, scale: 1 },
      transition: { duration: 0 },
    },
    root: {
      animate: { opacity: 1, rotate: 0, scale: 1, y: 0 },
      transition: { duration: 0 },
    },
  },
  listening: {
    ...ORBZ_APPEARANCE_BY_STATE.listening,
    aura: {
      animate: { opacity: 0.52, scale: 1.05 },
      transition: { duration: 0 },
    },
    core: {
      animate: { opacity: 0.22, scale: 1 },
      transition: { duration: 0 },
    },
    field: {
      animate: { '--orb-angle': '36deg' },
      transition: { duration: 0 },
    },
    highlight: {
      animate: { opacity: 1, scale: 1.07, x: 0, y: 0 },
      transition: { duration: 0 },
    },
    ring: {
      animate: { opacity: 0.34, scale: 1.13 },
      transition: { duration: 0 },
    },
    root: {
      animate: { opacity: 1, rotate: 0, scale: 1.02, y: 0 },
      transition: { duration: 0 },
    },
  },
  thinking: {
    ...ORBZ_APPEARANCE_BY_STATE.thinking,
    aura: {
      animate: { opacity: 0.46, scale: 1.04 },
      transition: { duration: 0 },
    },
    core: {
      animate: { opacity: 0.28, scale: 0.96, x: '7%', y: '-4%' },
      transition: { duration: 0 },
    },
    field: {
      animate: { '--orb-angle': '92deg' },
      transition: { duration: 0 },
    },
    highlight: {
      animate: {
        opacity: 1,
        rotate: -3,
        scale: 1.09,
        x: '4%',
        y: '-3%',
      },
      transition: { duration: 0 },
    },
    ring: {
      animate: { opacity: 0.2, rotate: 120, scale: 1.04 },
      transition: { duration: 0 },
    },
    root: {
      animate: { opacity: 1, rotate: -1, scale: 1, y: 0 },
      transition: { duration: 0 },
    },
  },
  speaking: {
    ...ORBZ_APPEARANCE_BY_STATE.speaking,
    aura: {
      animate: { opacity: 0.62, scale: 1.08 },
      transition: { duration: 0 },
    },
    core: {
      animate: { opacity: 0.36, scale: 1.08 },
      transition: { duration: 0 },
    },
    field: {
      animate: { '--orb-angle': '148deg' },
      transition: { duration: 0 },
    },
    highlight: {
      animate: { opacity: 1, scale: 1.12, x: '2%', y: '-1%' },
      transition: { duration: 0 },
    },
    ring: {
      animate: { opacity: 0.28, scale: 1.16 },
      transition: { duration: 0 },
    },
    root: {
      animate: { opacity: 1, rotate: 0, scale: 1.035, y: 0 },
      transition: { duration: 0 },
    },
  },
  asleep: {
    ...ORBZ_APPEARANCE_BY_STATE.asleep,
    aura: {
      animate: { opacity: 0.12, scale: 0.95 },
      transition: { duration: 0 },
    },
    core: {
      animate: { opacity: 0.02, scale: 0.9 },
      transition: { duration: 0 },
    },
    field: {
      animate: { '--orb-angle': '8deg' },
      transition: { duration: 0 },
    },
    highlight: {
      animate: { opacity: 0.22, scale: 1, x: 0, y: '2%' },
      transition: { duration: 0 },
    },
    ring: {
      animate: { opacity: 0, scale: 0.94 },
      transition: { duration: 0 },
    },
    root: {
      animate: { opacity: 0.72, rotate: 0, scale: 0.97, y: 2 },
      transition: { duration: 0 },
    },
  },
}

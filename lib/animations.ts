import { Variants } from 'framer-motion';

/**
 * Reusable Framer Motion Animation Variants
 *
 * This library provides pre-configured animation variants for consistent
 * and performant animations throughout the application.
 *
 * Performance considerations:
 * - All animations use transform and opacity (GPU-accelerated)
 * - Avoid animating width, height, top, left (causes layout recalculation)
 * - Duration and easing follow design system tokens
 * - Animations automatically respect prefers-reduced-motion when used with MotionConfig
 */

/**
 * Fade in from bottom animation
 * Used for: Cards, sections, confirmation screen
 *
 * @example
 * <motion.div variants={fadeInUp} initial="initial" animate="animate">
 *   Content
 * </motion.div>
 */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
};

/**
 * Scale in animation with spring
 * Used for: Success icons, important elements
 *
 * Creates a bouncy, playful entrance effect suitable for celebratory moments
 */
export const scaleIn: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15 }
  },
};

/**
 * Stagger children animation
 * Used for: Lists, countdown timer units
 *
 * Parent container variant that animates children with a stagger delay.
 * Children should have their own animation variants (e.g., fadeInUp)
 *
 * @example
 * <motion.div variants={staggerContainer} initial="initial" animate="animate">
 *   <motion.div variants={fadeInUp}>Child 1</motion.div>
 *   <motion.div variants={fadeInUp}>Child 2</motion.div>
 * </motion.div>
 */
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Flip animation for countdown numbers
 * Used for: Countdown timer digit changes
 *
 * Creates a 3D flip effect when numbers update
 */
export const countdownFlip: Variants = {
  initial: { rotateX: 0 },
  animate: {
    rotateX: 360,
    transition: { duration: 0.6, ease: 'easeInOut' }
  },
};

/**
 * Slide in from left animation
 * Used for: Toast notifications, side elements
 */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

/**
 * Slide in from right animation
 * Used for: Toast notifications, side elements
 */
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

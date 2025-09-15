/**
 * Robust body scroll lock with position restore for iOS Safari compatibility
 *
 * Features:
 * - Prevents background scroll while modals are open
 * - Preserves scroll position across modal open/close cycles
 * - Handles iOS Safari viewport behavior correctly
 * - Compensates for scrollbar width to prevent layout shifts
 * - Manages overscroll behavior for mobile devices
 */

interface ScrollLockState {
  originalScrollY: number;
  originalOverflow: string;
  originalPaddingRight: string;
  originalPosition: string;
  originalTop: string;
  originalWidth: string;
  originalOverscrollBehavior: string;
}

class ScrollLockManager {
  private lockCount = 0;
  private originalState: ScrollLockState | null = null;

  /**
   * Locks body scroll and stores current scroll position
   * Safe to call multiple times - uses reference counting
   */
  lock(): void {
    this.lockCount++;

    // Only apply lock on first call
    if (this.lockCount === 1) {
      this.applyLock();
    }
  }

  /**
   * Unlocks body scroll and restores original position
   * Safe to call multiple times - uses reference counting
   */
  unlock(): void {
    this.lockCount = Math.max(0, this.lockCount - 1);

    // Only remove lock when count reaches zero
    if (this.lockCount === 0) {
      this.removeLock();
    }
  }

  /**
   * Force unlock regardless of reference count
   * Useful for cleanup scenarios
   */
  forceUnlock(): void {
    this.lockCount = 0;
    this.removeLock();
  }

  /**
   * Check if scroll is currently locked
   */
  isLocked(): boolean {
    return this.lockCount > 0;
  }

  private applyLock(): void {
    const body = document.body;
    const documentElement = document.documentElement;

    // Store current state
    this.originalState = {
      originalScrollY: window.scrollY || documentElement.scrollTop,
      originalOverflow: body.style.overflow,
      originalPaddingRight: body.style.paddingRight,
      originalPosition: body.style.position,
      originalTop: body.style.top,
      originalWidth: body.style.width,
      originalOverscrollBehavior: documentElement.style.overscrollBehavior,
    };

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    // Apply lock styles
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // iOS Safari fix: Use fixed positioning with negative top
    body.style.position = 'fixed';
    body.style.top = `-${this.originalState.originalScrollY}px`;
    body.style.width = '100%';

    // Prevent overscroll behavior on mobile
    documentElement.style.overscrollBehavior = 'contain';
  }

  private removeLock(): void {
    if (!this.originalState) return;

    const body = document.body;
    const documentElement = document.documentElement;
    const { originalScrollY } = this.originalState;

    // Restore original styles
    body.style.overflow = this.originalState.originalOverflow;
    body.style.paddingRight = this.originalState.originalPaddingRight;
    body.style.position = this.originalState.originalPosition;
    body.style.top = this.originalState.originalTop;
    body.style.width = this.originalState.originalWidth;
    documentElement.style.overscrollBehavior = this.originalState.originalOverscrollBehavior;

    // Restore scroll position
    // Use requestAnimationFrame to ensure DOM updates are complete
    requestAnimationFrame(() => {
      window.scrollTo(0, originalScrollY);
    });

    this.originalState = null;
  }
}

// Export singleton instance
export const scrollLockManager = new ScrollLockManager();

// Convenience functions for direct usage
export const lockBodyScroll = () => scrollLockManager.lock();
export const unlockBodyScroll = () => scrollLockManager.unlock();
export const forceUnlockBodyScroll = () => scrollLockManager.forceUnlock();
export const isBodyScrollLocked = () => scrollLockManager.isLocked();
import { create } from 'zustand';

/**
 * GSAP Flip state type
 * We store the Flip state object returned by Flip.getState()
 */
export type FlipState = ReturnType<typeof import('gsap/Flip').Flip.getState>;

type TransitionState = {
  selectedId: string | null;
  originState: FlipState | null;
  originRect: DOMRect | null;
  setTransition: (id: string, state: FlipState | null, rect: DOMRect | null) => void;
  reset: () => void;
};

export const useTransitionStore = create<TransitionState>((set) => ({
  selectedId: null,
  originState: null,
  originRect: null,
  setTransition: (id: string, state: FlipState | null, rect: DOMRect | null) =>
    set({
      selectedId: id,
      originState: state,
      originRect: rect,
    }),
  reset: () =>
    set({
      selectedId: null,
      originState: null,
      originRect: null,
    }),
}));


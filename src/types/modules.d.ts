declare module 'split-type' {
  interface SplitTypeOptions {
    types?: string;
    tagName?: string;
  }

  class SplitType {
    constructor(element: HTMLElement | string, options?: SplitTypeOptions);
    lines: HTMLElement[];
    words: HTMLElement[];
    chars: HTMLElement[];
    split(options?: SplitTypeOptions): void;
    revert(): void;
  }

  export default SplitType;
}

declare module '@studio-freight/lenis' {
  interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
  }

  class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    on(event: string, callback: (...args: any[]) => void): void;
    destroy(): void;
  }

  export default Lenis;
}

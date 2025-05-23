declare module 'animejs' {
  interface AnimeParams {
    targets: string | string[] | Element | Element[] | NodeList | null | undefined;
    duration?: number;
    delay?: number;
    endDelay?: number;
    elasticity?: number;
    round?: number;
    loop?: boolean | number;
    direction?: 'normal' | 'reverse' | 'alternate';
    easing?: string;
    autoplay?: boolean;
    [prop: string]: any;
  }

  interface AnimeInstance {
    play: () => void;
    pause: () => void;
    restart: () => void;
    seek: (time: number) => void;
    reverse: () => void;
    [prop: string]: any;
  }

  interface AnimeStatic {
    (params: AnimeParams): AnimeInstance;
    version: string;
    speed: number;
    running: AnimeInstance[];
    easings: { [name: string]: (t: number) => number };
    path: (path: string | Element, percent?: number) => (prop: string) => string;
    setDashoffset: (el: Element) => number;
    bezier: (coordinates: [number, number][]) => (t: number) => number;
    stagger: (value: number | string, options?: { from?: number | string | any; direction?: string; easing?: string }) => (el: Element, i: number, total: number) => number;
    timeline: (params?: AnimeParams) => AnimeInstance;
    random: (min: number, max: number) => number;
  }

  const anime: AnimeStatic;
  export default anime;
} 
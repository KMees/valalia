import { analyticsSink } from "@/lib/env";

export type AnalyticsEvent = {
  name: string;
  props: Record<string, string | number>;
  at: string;
};

const events: AnalyticsEvent[] = [];

export function track(name: string, props: Record<string, string | number> = {}): void {
  const event = { name, props, at: new Date().toISOString() };
  events.push(event);
  if (typeof window !== "undefined") {
    const target = window as Window & { __valaliaEvents?: AnalyticsEvent[] };
    target.__valaliaEvents = events;
  }
  if (analyticsSink() === "console") {
    console.info("[analytics]", name, props);
  }
}

export function analyticsEvents(): AnalyticsEvent[] {
  return events;
}

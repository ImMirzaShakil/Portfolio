import type { AboutContent } from "@/lib/types";

export function getFunFacts(about?: AboutContent | null): string[] {
  if (!about) {
    return ["Building thoughtful digital experiences."];
  }

  if (about.fun_facts && about.fun_facts.length > 0) {
    return about.fun_facts;
  }

  const facts = [
    about.superpower_1,
    about.superpower_2,
    about.superpower_3,
  ].filter((fact): fact is string => Boolean(fact));

  if (facts.length > 0) {
    return facts;
  }

  return ["Building thoughtful digital experiences."];
}

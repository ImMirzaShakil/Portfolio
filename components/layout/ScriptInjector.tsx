"use client";

import { useEffect } from "react";

interface ScriptInjectorProps {
  snippets: string[];
}

function injectSnippet(snippet: string) {
  const template = document.createElement("template");
  template.innerHTML = snippet.trim();
  const nodes = Array.from(template.content.childNodes);

  nodes.forEach((node) => {
    if (node.nodeName === "SCRIPT") {
      const source = node as HTMLScriptElement;
      const script = document.createElement("script");

      Array.from(source.attributes).forEach((attribute) => {
        script.setAttribute(attribute.name, attribute.value);
      });

      if (source.textContent) {
        script.textContent = source.textContent;
      }

      document.head.appendChild(script);
      return;
    }

    document.head.appendChild(node.cloneNode(true));
  });
}

export function ScriptInjector({ snippets }: ScriptInjectorProps) {
  useEffect(() => {
    snippets.forEach((snippet) => {
      if (snippet.trim()) {
        injectSnippet(snippet);
      }
    });
  }, [snippets]);

  return null;
}

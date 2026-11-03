type Child = Node | string | null | undefined | false;
type Attrs = Record<string, string | boolean | undefined>;

/** Kleiner Helfer zum Erzeugen von Elementen. Texte werden immer als Text eingefügt, nie als HTML. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    node.setAttribute(name, value === true ? "" : value);
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child);
  }
  return node;
}

export interface View {
  node: HTMLElement;
  focus?: HTMLElement; // Element, das nach dem Screenwechsel den Fokus bekommt
}

export function externalLink(href: string, text: string, className?: string): HTMLAnchorElement {
  return el("a", { href, class: className, target: "_blank", rel: "noopener noreferrer" }, text);
}

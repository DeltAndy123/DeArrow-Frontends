export function htmlToElement(html: string) {
  const template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild as HTMLElement;
}

// type AttributesObj = { [key: string]: string, listeners: Record<string, EventListener> };
interface AttributesObj {
  [key: string]: string | Record<string, EventListener> | undefined;
  listeners?: Record<string, EventListener>;
}

/**
 * Create an element with a tag name, attributes, and children
 * @param tag - The tag name of the element
 * @param attributes - The attributes of the element, or the text content of the element, or the children of the element
 * @param children - The text content of the element, or the children of the element
 * @returns The created element
 * @example
 * const el = $$("div#test", { style: "display: inline" }, "Hello world");
 * // <div id="test" style="display: inline">Hello world</div>
 */
export function $$<T extends keyof HTMLElementTagNameMap | string>(tag: T | string, attributes?: AttributesObj | string | HTMLElement | (string | HTMLElement)[], children?: string | HTMLElement | (string | HTMLElement)[]): T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement {
  const parts = tag.split(/(?=[.#])/g);
  if (!parts.length) throw new Error("Invalid tag")
  const el = document.createElement(parts.shift()!) as T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement;
  if (parts.length) {
    const id = parts.find((p) => p.startsWith("#"))?.slice(1);
    if (id) el.id = id;
    const classes = parts.filter((p) => p.startsWith(".")).map((p) => p.slice(1));
    if (classes.length) el.classList.add(...classes);
  }

  if (typeof attributes === "string") {
    el.textContent = attributes;
  } else if (attributes instanceof HTMLElement) {
    el.appendChild(attributes);
  } else if (Array.isArray(attributes)) {
    attributes.forEach((child) => {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    })
  } else if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "listeners") {
        Object.entries(value as Record<string, EventListener>).forEach(([event, listener]) => {
          el.addEventListener(event, listener);
        })
      } else el.setAttribute(key, (value === undefined ? "" : value) as string);
    })
  }

  if (children) {
    if (typeof children === "string") {
      el.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach((child) => {
        if (typeof child === "string") {
          el.appendChild(document.createTextNode(child));
        } else {
          el.appendChild(child);
        }
      })
    } else {
      el.appendChild(children);
    }
  }

  return el;
}

export const settingsIcon = htmlToElement(`
<svg
   width="18px"
   height="18px"
   viewBox="0 0 36 36"
   aria-hidden="true"
   role="img"
   class="iconify iconify--twemoji"
   preserveAspectRatio="xMidYMid meet"
   id="svg10"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg">
  <defs
     id="defs14" />
  <sodipodi:namedview
     id="namedview12"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:showpageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     inkscape:deskcolor="#d1d1d1"
     showgrid="false"
     inkscape:zoom="0.65479573"
     inkscape:cx="493.2836"
     inkscape:cy="514.66432"
     inkscape:window-width="1920"
     inkscape:window-height="983"
     inkscape:window-x="435"
     inkscape:window-y="768"
     inkscape:window-maximized="1"
     inkscape:current-layer="svg10" />
  <path
     fill="#1213BD"
     d="M36 18.302c0 4.981-2.46 9.198-5.655 12.462s-7.323 5.152-12.199 5.152s-9.764-1.112-12.959-4.376S0 23.283 0 18.302s2.574-9.38 5.769-12.644S13.271 0 18.146 0s9.394 2.178 12.589 5.442C33.931 8.706 36 13.322 36 18.302z"
     id="path2" />
  <path
     fill="#ffffff"
     d="m 30.394282,18.410186 c 0,3.468849 -1.143025,6.865475 -3.416513,9.137917 -2.273489,2.272442 -5.670115,2.92874 -9.137918,2.92874 -3.467803,0 -6.373515,-1.147212 -8.6470033,-3.419654 -2.2734888,-2.272442 -3.5871299,-5.178154 -3.5871299,-8.647003 0,-3.46885 0.9420533,-6.746149 3.2144954,-9.0196379 2.2724418,-2.2734888 5.5507878,-3.9513905 9.0196378,-3.9513905 3.46885,0 6.492841,1.9322561 8.76633,4.204698 2.273489,2.2724424 3.788101,5.2974804 3.788101,8.7663304 z"
     id="path4"
     style="fill:#88c9f9;fill-opacity:1;stroke-width:1.04673" />
  <path
     fill="#292f33"
     d="m 23.95823,17.818306 c 0,3.153748 -2.644888,5.808102 -5.798635,5.808102 -3.153748,0 -5.599825,-2.654354 -5.599825,-5.808102 0,-3.153747 2.446077,-5.721714 5.599825,-5.721714 3.153747,0 5.798635,2.567967 5.798635,5.721714 z"
     id="path8"
     style="stroke-width:1.18339;fill:#0a62a5;fill-opacity:1" />
</svg>
`)
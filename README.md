# `@grace-studio/graceful-figma`

[![npm version](https://badge.fury.io/js/@grace-studio%2Fgraceful-figma.svg)](https://badge.fury.io/js/@grace-studio%2Fgraceful-figma)

## ✨ Graceful Figma

A CLI tool for **pulling SVGs** (icons, logos, illustrations, any vector) from **Figma designs** into plain **`.svg` files** for any library, or **React components** with automatic **TypeScript types** and lazy imports.

---

## 📦 Installation

```bash
yarn add -D @grace-studio/graceful-figma
# or
npm install -D @grace-studio/graceful-figma
```

Requires **Node.js 22.18 or later**.

---

## 🚀 Quick Start

```bash
graceful-figma svgs        # .svg files
graceful-figma react-svgs  # React components
```

Both commands take the same options:

| Option | Description |
|---|---|
| `-o, --out <dir>` | Output dir, overrides `out` in the config |
| `-f, --force [boolean]` | Skip the confirmation before clearing the output dir (`--force false` to ask anyway) |

> ⚠️ The output dir is **cleared before writing**. It must be a folder inside the project root.

---

## 🛠️ Configuration

Add a `graceful.config.ts` (or `graceful.config.js` / `graceful.config.mjs`) file to your project root:

```typescript
import type { FigmaFetchSource, GracefulConfig } from "@grace-studio/graceful-figma";

const sources: FigmaFetchSource[] = [
  {
    alias: "Graceful",
    fileKey: "abc123",
    pageName: "Graphics",
    sectionName: ["Icons", "Logos"]
  },
  {
    fileKey: "def456",
    pageName: "Illustrations",
    sectionName: "Heroes",
    shouldUseCurrentColor: false
  }
];

const config: GracefulConfig = {
  svgs: {
    out: "./public/svgs",
    sources
  },
  "react-svgs": {
    token: "optional-figma-access-token",
    out: "./src/svgs",
    force: true,
    sources
  }
};

export default config;
```

The `.ts` config is loaded with Node's built-in type stripping, so use `import type` for types and avoid TypeScript-only runtime syntax such as `enum`.

`sectionName` takes an array or a comma-separated string. Page and section names are matched case-insensitively.

`shouldUseCurrentColor` (default `true`) replaces fill and stroke colors with `currentColor`, so the SVG takes the CSS `color`. `none` and gradients are kept. Set it to `false` for multicolor SVGs like logos and illustrations.

---

## 🔑 Figma Access Token

Two options:

- **Recommended (via `.env` or `.env.local` file):**

```properties
FIGMA_ACCESS_TOKEN=your-secret-token
```

- **Or inline in config:**

```typescript
const config: GracefulConfig = {
  "react-svgs": {
    token: "your-secret-token",
    // ... other options
  }
};
```

If the token is set in several places, the first one found wins: shell environment, `.env.local`, `.env`, config `token`. Without a token you are prompted for one.

---

## ✅ What Gets Generated?

### `svgs`: plain `.svg` files

One file per component, in a folder per Figma file, page and section:

```
public/svgs/my-file/graphics/icons/my-svg.svg
```

Like the React components, each root `<svg>` gets the `gf-svg` class and a `data-svg-name` with its Figma path.

Use them with anything: `<img>`, CSS `mask-image`, Vue/Svelte/Angular SVG loaders, sprite builders. Note that `currentColor` has no effect when an SVG is loaded through `<img>` or as a background image, so turn off `shouldUseCurrentColor` for SVGs used that way.

### `react-svgs`: React components

#### 1. ✅ Pure React SVG Components (CurrentColor, Typed)

Each SVG becomes a **plain React functional component** exporting a `<svg>` element.

**Key characteristics:**

- **No external dependencies** (just React + SVG)
- **Color inherits via `currentColor`** (unless `shouldUseCurrentColor: false`): set it with CSS `color` or the `color` prop
- **`gf-svg` class and `data-svg-name`** (the Figma path) on every SVG
- **Typed with `SVGProps<SVGSVGElement>` for full prop control**

Example generated file: `MySvg.tsx`

```tsx
import type { SVGProps } from "react";

const MySvg = ({ className = "", ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-svg-name="graceful/graphics/icons/my svg"
    width={32}
    height={32}
    fill="none"
    viewBox="0 0 32 32"
    className={`${className} gf-svg`.trim()}
    {...props}
  >
    <path d="..." fill="currentColor" />
  </svg>
);

export default MySvg;
```

---

#### 2. ✅ Tree-Structured Lazy Import File

An automatically generated **svgs object** with **`React.lazy` imports**, mirroring your Figma structure. Works in any React app, including Next.js. Each SVG is loaded on first render, so render them inside a `<Suspense>` boundary (`SvgByName` adds one).

Example structure:

```ts
import { lazy } from "react";

const Svgs = {
  Graceful: {
    Icons: {
      MySvg: lazy(() => import("./graceful/graphics/icons/MySvg")),
      ...
    },
  },
  ConfiguratorGraphics: {
    Misc: {
      AnotherSvg: lazy(() => import("./configurator/graphics/misc/AnotherSvg")),
      ...
    },
  },
};

export default Svgs;
```

---

#### 3. ✅ Type-Safe SVG Name Types (Auto-Generated)

`SvgByName/types.ts` lists every SVG name as a literal union, so added or removed SVGs show up in your diffs:

```ts
export type SvgName =
  | "ConfiguratorGraphics.Misc.AnotherSvg"
  | "Graceful.Icons.MySvg"
  | ...;
```

Use it in your own props:

```ts
import type { SvgName } from "./src/svgs/SvgByName";

type ButtonProps = { icon: SvgName };
```

---

#### 4. ✅ Ready-to-Use `<SvgByName />` Component

A utility component for rendering SVGs **by name string**, with full **TypeScript autocomplete** and **type checking**:

```tsx
import SvgByName from "./src/svgs/SvgByName";

<SvgByName name="Graceful.Icons.MySvg" />
```

✅ Autocomplete  
✅ Type-safe  
✅ Optional SVG props (`width`, `className`, etc.)

An unknown name (e.g. from a CMS) renders nothing.

---

## 🧪 Example Workflow

1. Prepare your Figma file
2. Configure `graceful.config.ts`
3. Run:

```bash
graceful-figma react-svgs
```

4. Import and use anywhere in your app:

```tsx
import SvgByName from "./src/svgs/SvgByName";

export function MyButton() {
  return <SvgByName name="ConfiguratorGraphics.Misc.AnotherSvg" />;
}
```

---

## ⚠️ Troubleshooting

| Issue | Solution |
|---|---|
| **Missing Access Token** | Set your token in `.env` or config file |
| **Invalid file key** | Double-check your Figma URL |
| **Page not found** | The error lists the pages in the file, check `pageName` |
| **Empty output** | Verify `pageName` and `sectionName` |
| **Invalid output dir** | `out` must be a folder inside the project root |
| **SVG is black in `<img>`** | `currentColor` doesn't apply there, set `shouldUseCurrentColor: false` |

---

## ✅ Features Summary

- ✅ Extracts any SVG from Figma: icons, logos, illustrations
- ✅ Writes plain `.svg` files usable by any library
- ✅ Outputs pure `<svg>` React components, with `currentColor` per source
- ✅ Generates TypeScript types for SVG names
- ✅ Provides a typed `<SvgByName />` lookup component
- ✅ Outputs lazy import trees for any React app
- ✅ Supports `.env` token management
- ✅ Supports multiple Figma files/sections

---

## 📄 License

MIT

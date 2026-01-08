
# `@grace-studio/graceful-figma`

[![npm version](https://badge.fury.io/js/@grace-studio%2Fgraceful-figma.svg)](https://badge.fury.io/js/@grace-studio%2Fgraceful-figma)

## ✨ Graceful Figma

A CLI tool for **extracting React icon components** directly from **Figma designs**, with automatic **TypeScript types** and **Next.js-compatible dynamic imports**.

---

## 📦 Installation

```bash
npm install -D @grace-studio/graceful-figma
# or
yarn add -D @grace-studio/graceful-figma
```

---

## 🚀 Quick Start

```bash
graceful-figma react-icons
```

---

## 🛠️ Configuration

Add a `graceful.config.ts` file to your project root:

```typescript
import type { GracefulConfig } from '@grace-studio/graceful-figma';

const config: GracefulConfig = {
  "react-icons": {
    token: "optional-figma-access-token",
    out: "./src/icons",
    force: true,
    sources: [
      {
        alias: "GracefulIcons",
        fileKey: "abc123",
        pageName: "Icons",
        sectionName: ["Primary", "Secondary"]
      },
      {
        fileKey: "def456",
        pageName: "UI",
        sectionName: "Buttons"
      }
    ]
  }
};

export default config;
```

---

## 🔑 Figma Access Token

Two options:

- **Recommended (via `.env` file):**

```properties
FIGMA_ACCESS_TOKEN=your-secret-token
```

- **Or inline in config:**

```typescript
const config: GracefulConfig = {
  "react-icons": {
    token: "your-secret-token",
    // ... other options
  }
};
```

---

## ✅ What Gets Generated?

After running:

```bash
graceful-figma react-icons
```

You get:

### 1. ✅ Pure React SVG Components (CurrentColor, Typed)

Each icon becomes a **plain React functional component** exporting a `<svg>` element.

**Key characteristics:**

- **No external dependencies** (just React + SVG)
- **Color inherits via `currentColor`**
- **Typed with `SVGProps<SVGSVGElement>` for full prop control**

Example generated file: `MyIcon.tsx`

```tsx
import type { SVGProps } from "react";

const MyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="currentColor"
    viewBox="0 0 32 32"
    {...props}
  >
    <path d="..." />
  </svg>
);

export default MyIcon;
```

---

### 2. ✅ Tree-Structured Dynamic Import File (Next.js Compatible)

An automatically generated **icons object** with **Next.js `dynamic()` imports**, mirroring your Figma structure.

Example structure:

```ts
import dynamic from "next/dynamic";

const Icons = {
  Graceful: {
    Icons: {
      MyIcon: dynamic(() => import("./icon-pack/icons/icons/MyIcon")),
      ...
    },
  },
  Configuratoricons: {
    Misc: {
      AnotherIcon: dynamic(() => import("./configurator/icons/misc/AnotherIcon")),
      ...
    },
  },
};

export default Icons;
```

---

### 3. ✅ Type-Safe Icon Name Types (Auto-Generated)

A TypeScript utility type for **type-safe icon name strings**, based on the import tree:

```ts
type IconName =
  | "Graceful.Icons.MyIcon"
  | "Configuratoricons.Misc.AnotherIcon"
  | ...;
```

---

### 4. ✅ Ready-to-Use `<IconByName />` Component

A utility component for rendering icons **by name string**, with full **TypeScript autocomplete** and **type checking**:

```tsx
import IconByName from "./src/icons/IconByName";

<IconByName name="Graceful.Icons.MyIcon" />
```

✅ Autocomplete  
✅ Type-safe  
✅ Optional SVG props (`width`, `className`, etc.)

---

## 🧪 Example Workflow

1. Prepare your Figma file
2. Configure `graceful.config.ts`
3. Run:

```bash
graceful-figma react-icons
```

4. Import and use anywhere in your app:

```tsx
import IconByName from "./src/icons/IconByName";

export function MyButton() {
  return <IconByName name="Configuratoricons.Misc.AnotherIcon" />;
}
```

---

## ⚠️ Troubleshooting

| Issue | Solution |
|---|---|
| **Missing Access Token** | Set your token in `.env` or config file |
| **Invalid file key** | Double-check your Figma URL |
| **Empty icon output** | Verify `pageName` and `sectionName` |
| **Next.js build errors** | Ensure you're using dynamic imports and not SSR for icons |

---

## ✅ Features Summary

- ✅ Extracts React SVG icons from Figma
- ✅ Outputs pure `<svg>` React components with `currentColor` fill
- ✅ Generates TypeScript types for icon names
- ✅ Provides a typed `<IconByName />` lookup component
- ✅ Outputs Next.js-optimized dynamic import trees
- ✅ Supports `.env` token management
- ✅ Supports multiple Figma files/sections

---

## 📄 License

MIT

import { createElement, type ReactNode } from "react";

export default function calcRate(rate: number): ReactNode {
  const normalizedRate = Number.isFinite(rate)
    ? Math.min(5, Math.max(0, rate))
    : 0;
  const fillWidth = `${(normalizedRate / 5) * 100}%`;

  return createElement(
    "span",
    {
      role: "img",
      "aria-label": `Rated ${normalizedRate.toFixed(1)} out of 5 stars`,
      className: "relative inline-block whitespace-nowrap leading-none",
    },
    createElement("span", { "aria-hidden": true, className: "text-stone-300" }, "★★★★★"),
    createElement(
      "span",
      {
        "aria-hidden": true,
        className: "absolute left-0 top-0 overflow-hidden whitespace-nowrap text-amber-400",
        style: { width: fillWidth },
      },
      "★★★★★",
    ),
  );
}

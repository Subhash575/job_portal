import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Pastel tile + dark letter (contrast-safe), picked from the company name so it stays the same everywhere.
const TILES = [
  ["#ffd8c2", "#9a3412"],
  ["#c9f0dc", "#166534"],
  ["#cfe3ff", "#1e40af"],
  ["#fdeaa7", "#854d0e"],
  ["#fbd3e6", "#9d174d"],
  ["#e4dcff", "#5b21b6"],
];
export const tileFor = name =>
  TILES[[...(name || "")].reduce((n, c) => n + c.charCodeAt(0), 0) % TILES.length];

// Salary chips filter by number, not text: [above, up to] in LPA, so 25.5 LPA still lands in a range.
export const SALARY_RANGES = {
  "0LPA-25LPA": [-Infinity, 25],
  "26LPA-95LPA": [25, 95],
  "96LPA and More": [95, Infinity],
};

import { writable } from "svelte/store"

const defaultTurns = [
  {
    description: "current values",
    resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 }
  },
  {
    description: "",
    resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 }
  },
  {
    description: "",
    resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 }
  },
  {
    description: "",
    resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 }
  },
]

const itemName = "turns";
const retrieved = localStorage.getItem(itemName);
const parsed = JSON.parse(retrieved);
export const turns = writable(parsed === null ? defaultTurns : parsed);

turns.subscribe(value =>
  localStorage.setItem(itemName, JSON.stringify(value))
)

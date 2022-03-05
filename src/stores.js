import { readable, writable } from "svelte/store"

const d = [
  {
    description: "current values",
    resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 },
    id: 0,
  },
  {
    description: "",
    resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 },
    id: 1,
  },
  {
    description: "",
    resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 },
    id: 2,
  },
  {
    description: "",
    resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 },
    id: 3,
  },
]

const itemName = "turns";
const retrieved = localStorage.getItem(itemName);
const parsed = JSON.parse(retrieved);
export const turns = writable(parsed === null ? d : parsed);

turns.subscribe(value =>
  localStorage.setItem(itemName, JSON.stringify(value))
)

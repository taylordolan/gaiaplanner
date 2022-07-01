import { readable, writable } from "svelte/store"

const _newTurn = (id) => {
  return {
    description: "",
    resources: { c: 0, o: 0, k: 0, q: 0, v: 0 },
    excluded: false,
    completed: false,
    id: id,
  }
}

const _newPlan = () => {
  let plan = {
    label: "",
    notes: "",
    showNotes: false,
    turns: [
      _newTurn(0),
      _newTurn(1),
      _newTurn(2),
      _newTurn(3)
    ],
  };
  plan.turns[0].description = "current values";
  return plan;
}

const _example = () => {
  return [
    {
      label: "Example Plan",
      notes: "",
      showNotes: false,
      turns: [
        {
          description: "current values",
          resources: { c: 2, o: 0, k: 4, q: 0, v: 0 },
          excluded: false,
          completed: false,
          id: 0,
        },
        {
          description: "research artificial intelligence",
          resources: { c: 0, o: 0, k: -4, q: 1, v: 0 },
          excluded: false,
          completed: false,
          id: 1,
        },
        {
          description: "(free action)",
          resources: { c: 0, o: 1, k: 0, q: 0, v: 0 },
          excluded: false,
          completed: false,
          id: 2,
        },
        {
          description: "mine gaia planet",
          resources: { c: -2, o: -1, k: 0, q: -1, v: 0 },
          excluded: false,
          completed: false,
          id: 3,
        },
      ],
    }
];
}

export const newTurn = readable(_newTurn);
export const newPlan = readable(_newPlan);

const itemName = "plans";
const retrieved = localStorage.getItem(itemName);
const parsed = JSON.parse(retrieved);
export const plans = writable(parsed === null ? _example() : parsed);

plans.subscribe(value =>
  localStorage.setItem(itemName, JSON.stringify(value))
)

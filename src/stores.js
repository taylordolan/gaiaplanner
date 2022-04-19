import { readable, writable } from "svelte/store"

const _newTurn = (id) => {
  return {
    description: "",
    resources: { c: 0, o: 0, k: 0, q: 0, v: 0 },
    enabled: true,
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

const _plans = () => {
  return [_newPlan()];
}

export const newTurn = readable(_newTurn);
export const newPlan = readable(_newPlan);

const itemName = "plans";
const retrieved = localStorage.getItem(itemName);
const parsed = JSON.parse(retrieved);
export const plans = writable(parsed === null ? _plans() : parsed);

plans.subscribe(value =>
  localStorage.setItem(itemName, JSON.stringify(value))
)

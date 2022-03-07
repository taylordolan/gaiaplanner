import { readable, writable } from "svelte/store"

const _newTurn = (id) => {
  let turn = {
    description: "",
    resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 },
    enabled: true,
    id: id,
  }
  return turn;
}

export const newTurn = readable(_newTurn);

const _defaultTurns = () => {
  let turns = [
    _newTurn(0),
    _newTurn(1),
    _newTurn(2),
    _newTurn(3),
  ]
  turns[0].description = "current values";
  return turns;
}

export const defaultTurns = readable(_defaultTurns);

const itemName = "turns";
const retrieved = localStorage.getItem(itemName);
const parsed = JSON.parse(retrieved);
export const turns = writable(parsed === null ? _defaultTurns() : parsed);

turns.subscribe(value =>
  localStorage.setItem(itemName, JSON.stringify(value))
)

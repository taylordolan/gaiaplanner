import { readable, writable } from "svelte/store"

const _newTurn = (id) => {
  let turn = {
    description: "",
    resources: { c: 0, o: 0, k: 0, q: 0, v: 0 },
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

let _games = () => {
  return [
    [_defaultTurns(), _defaultTurns()],
  ];
}

export const defaultTurns = readable(_defaultTurns);

const itemName = "games";
const retrieved = localStorage.getItem(itemName);
const parsed = JSON.parse(retrieved);
export const games = writable(parsed === null ? _games() : parsed);

games.subscribe(value =>
  localStorage.setItem(itemName, JSON.stringify(value))
)

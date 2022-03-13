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
  let turns = [
    _newTurn(0),
    _newTurn(1),
    _newTurn(2),
    _newTurn(3),
  ]
  turns[0].description = "current values";
  return turns;
}

const _newGame = () => {
  return [_newPlan()];
}

let _games = () => {
  return [_newGame()];
}

export const newTurn = readable(_newTurn);
export const newPlan = readable(_newPlan);
export const newGame = readable(_newGame);

const itemName = "games";
const retrieved = localStorage.getItem(itemName);
const parsed = JSON.parse(retrieved);
export const games = writable(parsed === null ? _games() : parsed);

games.subscribe(value =>
  localStorage.setItem(itemName, JSON.stringify(value))
)

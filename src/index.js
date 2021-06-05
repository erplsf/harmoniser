import {
  appendButton,
  fetchBalances,
  setConsole,
  calculateAvailableFunds,
} from "./app";

setConsole();

appendButton(document);

const balances = fetchBalances(document);

const funds = calculateAvailableFunds(balances);

console.log(funds);

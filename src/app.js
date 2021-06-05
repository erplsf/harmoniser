// CSS modules
import styles, { stylesheet } from "./style.module.css";
import { accountMap } from "./secrets.js";

export function appendButton(document) {
  VM.observe(document.body, () => {
    const node = document.querySelector(".function-panel");

    if (node) {
      const ul = node.querySelector(".gs-span-16");
      if (ul) {
        const dom = (
          <>
            <li className="gs-span-5">
              <a className={`link-default ${styles.emphasizedText}`} href="#">
                Harmonise!
              </a>
            </li>
            <style>{stylesheet}</style>
          </>
        );

        ul.prepend(dom);

        return true;
      }
    }
  });
}

export function setConsole() {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  console = iframe.contentWindow.console;
  window.console = console;
}

export function fetchBalances(document) {
  const balancesMap = {};
  for (const [type, account] of Object.entries(accountMap)) {
    const { iban } = account;
    const selector = document.querySelectorAll(".g2p-account__iban");
    const matches = [...selector].filter((el) => el.textContent == iban);
    if (matches.length == 1) {
      const node = matches[0];
      const row = node.closest(".g2p-account__row");
      if (row) {
        const amount = row.querySelector(".g2p-account__balance");
        if (amount) {
          const cleanAmount = amount.textContent
            .replaceAll(/(\s+|\.|€)/g, "")
            .replace(",", ".");

          balancesMap[type] = cleanAmount;
        }
      }
    }
  }
  return balancesMap;
}

export function calculateAvailableFunds(balancesMap) {
  var { threshold } = accountMap["extra"];
  var balance = balancesMap["extra"];
  const availableFundsForTransfer =
    new Fraction(balance) - new Fraction(threshold);
  var { threshold } = accountMap["main"];
  var balance = balancesMap["main"];
  const availableFundsInMain = new Fraction(balance) - new Fraction(threshold);
  const availableFundsForInvesting =
    availableFundsForTransfer + availableFundsInMain;
  return {
    amountToTransfer: availableFundsForTransfer,
    amountToInvest: availableFundsForInvesting,
  };
}

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
              <a
                className={`link-default ${styles.emphasizedText}`}
                onClick={() => harmonise(document, true)}
                href="#"
              >
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

export function harmonise(document, clicked = false) {
  if (clicked) {
    // reset the state if user clicked the button
    // TODO: change later to ad double-click for reset
    GM_setValue("state", "");
  }
  const state = GM_getValue("state", "");
  switch (state) {
    case "":
      console.log("empty state case");
      const balances = fetchBalances(document);
      setAvailableFunds(balances);
      harmonise(document);
      break;
    case "fundsCalculated":
      console.log("fundsCalculated state");
      break;
    default:
      console.log("default switch case");
  }
}

function fetchBalances(document) {
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

function setAvailableFunds(balancesMap) {
  var { threshold } = accountMap["extra"];
  var balance = balancesMap["extra"];
  const availableFundsForTransfer =
    new Fraction(balance) - new Fraction(threshold);
  var { threshold } = accountMap["main"];
  var balance = balancesMap["main"];
  const availableFundsInMain = new Fraction(balance) - new Fraction(threshold);
  const availableFundsForInvesting =
    availableFundsForTransfer + availableFundsInMain;
  const fundsMap = {
    amountToTransfer: availableFundsForTransfer,
    amountToInvest: availableFundsForInvesting,
  };
  GM_setValue("state", "fundsCalculated");
  GM_setValue("calculatedFunds", fundsMap);
}

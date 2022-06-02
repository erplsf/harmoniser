import styles, {stylesheet} from './style.module.css'
import secrets from './secrets'

export function appendButton(document: Document) {
  VM.observe(document.body, () => {
    const node = document.querySelector('.function-panel')

    if (node) {
      const ul = node.querySelector('.gs-span-16')
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
        )

        ul.prepend(String(dom))

        return true
      }
    }
    return false
  })
}

export function harmonise(document: Document, clicked = false) {
  const strippedLocation = window.location.toString().replaceAll(/\?.*/g, '')
  if (clicked && strippedLocation === 'https://banking.ing.de/app/obligo') {
    // reset the state if user clicked the button
    // TODO: change later to add double-click for reset
    GM_setValue('state', '')
  }
  const state = GM_getValue('state', '')
  const extraTransferLink = getTransferLink(secrets.accountMap.extra)
  switch (state) {
    case '': {
      console.log('empty state case')
      GM_setValue('state', 'calculatingRealBalance')
      const accountLink = getAccountLink(secrets.accountMap.main)
      window.location.assign(accountLink)
      break
    }
    case 'calculatingRealBalance': {
      console.log('calculatingRealBalance state')
      const balance = getAccountBalance(document)
      const pending = getPendingBalance(document)
      const realBalance = new Fraction(balance).add(new Fraction(pending))
      GM_setValue('realBalance', realBalance.round(2).toString())
      GM_setValue('state', 'calculatingFunds')
      window.location.assign('https://banking.ing.de/app/obligo')
      break
    }
    case 'calculatingFunds': {
      console.log('calculatingFunds state')
      const balances = fetchBalances(document)
      calculateAvailableFunds(balances)
      window.location.reload()
      break
    }
    case 'fundsCalculated': {
      console.log('fundsCalculated state')

      if (strippedLocation !== extraTransferLink) {
        GM_setValue('state', 'transferringFundsFromExtra')
        window.location.assign(extraTransferLink)
      }
      break
    }
    case 'transferringFundsFromExtra': {
      console.log('transferringFundsFromExtra state')
      if (strippedLocation === extraTransferLink) {
        const input = getInputElement(document)
        const fundsMap = GM_getValue('calculatedFunds', {})
        console.log(fundsMap)
        input.value = fundsMap.amountToTransfer.replace('.', ',')
        const button = getNextButton(document)
        GM_setValue('state', 'waitingForExtraApproval')
        button.click()
      } else {
        window.location.assign(extraTransferLink)
      }
      break
    }
    case 'waitingForExtraApproval':
      console.log('waitingForExtraApproval state')
      // TODO: implement
      // if (strippedLocation === 'https://banking.ing.de/app/obligo') {
      // }
      break
    default:
      console.log('default switch case')
      console.log(state)
  }
}

function getInputElement(document: Document) {
  return document.querySelector(
    "input[name='view:eingabepanel:form:betrag:betrag']"
  )
}

function getNextButton(document: Document) {
  return document.querySelector("button[type='submit'][name='buttons:next']")
}

function getTransferLink(account: {
  accountNumber: string
  iban: string
}): string {
  let shortNumber
  if (account.accountNumber) {
    shortNumber = account.accountNumber
  } else {
    shortNumber = account.iban.replaceAll(/\s+/g, '').slice(-10)
  }
  return `https://banking.ing.de/app/ueberweisung_sepa/${shortNumber}`
}

function getAccountLink(account: {
  accountNumber: string
  iban: string
  prefix: string
}): string {
  let shortNumber
  if (account.accountNumber) {
    shortNumber = account.accountNumber
  } else {
    shortNumber = account.iban.replaceAll(/\s+/g, '').slice(-10)
  }
  return `https://banking.ing.de/app/${account.prefix}/${shortNumber}`
}

function cleanMoney(moneyString: string): string {
  return moneyString.replaceAll(/(\s+|\.|€)/g, '').replace(',', '.')
}

function getAccountBalance(document: Document, account = undefined) {
  if (account) {
    const {iban} = account
    const selector = document.querySelectorAll('.g2p-account__iban')
    const matches = [...selector].filter((el) => el.textContent === iban)
    if (matches.length === 1) {
      const node = matches[0]
      const row = node.closest('.g2p-account__row')
      if (row) {
        const amount = row.querySelector('.g2p-account__balance')
        if (amount) {
          return cleanMoney(amount.textContent)
        }
      }
    }
  } else {
    const node = document.querySelector(
      'span.g2p-banking-header__account__balance'
    )
    if (node) {
      return cleanMoney(node.textContent)
    }
  }
}

function getPendingBalance(document) {
  const node = document.querySelector('div.g2p-transaction-group--prebooked')
  if (node) {
    const span = node.querySelector('span.g2p-amount')
    if (span) {
      return cleanMoney(span.textContent)
    }
  }
}

function fetchBalances(document) {
  const balancesMap = {}
  for (const [type, account] of Object.entries(secrets.accountMap)) {
    const {iban} = account
    const selector = document.querySelectorAll('.g2p-account__iban')
    const matches = [...selector].filter((el) => el.textContent === iban)
    if (matches.length === 1) {
      const node = matches[0]
      const row = node.closest('.g2p-account__row')
      if (row) {
        const amount = row.querySelector('.g2p-account__balance')
        if (amount) {
          const cleanAmount = cleanMoney(amount.textContent)

          balancesMap[type] = cleanAmount
        }
      }
    }
  }
  return balancesMap
}

function calculateAvailableFunds(balancesMap) {
  let {threshold} = secrets.accountMap.extra
  const balance = balancesMap.extra
  const availableFundsForTransfer = new Fraction(balance).sub(
    new Fraction(threshold)
  )
  threshold = secrets.accountMap.main.threshold
  const realBalanceInMain = GM_getValue('realBalance', undefined)
  const availableFundsInMain = new Fraction(realBalanceInMain).sub(
    new Fraction(threshold)
  )
  const availableFundsForInvesting =
    availableFundsForTransfer.add(availableFundsInMain)
  const fundsMap = {
    amountToTransfer: availableFundsForTransfer.round(2).toString(),
    amountToInvest: availableFundsForInvesting.round(2).toString(),
  }
  console.log(fundsMap)
  GM_setValue('state', 'fundsCalculated')
  GM_setValue('calculatedFunds', fundsMap)
}

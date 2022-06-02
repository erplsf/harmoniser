import {appendButton, harmonise} from './app.tsx'
import {restoreConsole, locationMatches} from './util.ts'

restoreConsole()

if (
  locationMatches(window.location.href, 'https://banking.ing.de/app/obligo')
) {
  appendButton(document)
}

harmonise(document)

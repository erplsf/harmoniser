import { appendButton, harmonise } from './app';
import { restoreConsole, locationMatches } from './util';

restoreConsole();

if (
  locationMatches(window.location.href, 'https://banking.ing.de/app/obligo')
) {
  appendButton(document);
}

harmonise(document);

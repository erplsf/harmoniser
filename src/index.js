import { appendButton, restoreConsole, harmonise } from "./app";

restoreConsole();

if (
  window.location.href.replaceAll(/\?.+/g, "") ===
  "https://banking.ing.de/app/obligo"
) {
  appendButton(document);
}

harmonise(document);

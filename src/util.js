export function restoreConsole() {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  console = iframe.contentWindow.console;
  window.console = console;
}

export function locationMatches(location, rule) {
  return location.replaceAll(/\?.*/g, "") === rule;
}

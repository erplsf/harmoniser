export function restoreConsole() {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  const restoredConsole = iframe.contentWindow.console;
  window.console = restoredConsole;
}

export function locationMatches(location, rule) {
  return location.replaceAll(/\?.*/g, '') === rule;
}

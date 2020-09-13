// ==UserScript==
// @name     harmoniser
// @version  29
// @grant    none
// @include  https://banking.ing.de/app/depotbewertung*
// ==/UserScript==

function addScript(id, src) {
  let element = document.createElement('script');
  element.id = id;
  element.src = src;
  element.setAttribute('defer', '');
  element.setAttribute('type', 'module');
  element.setAttribute('crossorigin', 'anonymous');
  document.head.appendChild(element);
}

/*
function addStyle(id, src) {
  let element = document.createElement('link');
  element.id = id;
  element.setAttribute('href', src);
  element.setAttribute('type', 'text/css');
  element.setAttribute('rel', 'stylesheet');
  document.head.appendChild(element);
}
*/

// addScript('fraction.js', 'https://unpkg.com/fraction.js');

addScript('harmoniser', 'https://127.0.0.1:8080/harmoniser.js');

// addStyle('modal-styles', 'https://127.0.0.1:8080/modal-styles.css');

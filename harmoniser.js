import { el, mount, text } from "https://redom.js.org/redom.es.min.js";
import "https://unpkg.com/micromodal/dist/micromodal.min.js";

function visitDepot() {
  let docs = document.evaluate("//a[text()='Depotbewertung']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  docs.snapshotItem(0).click();
};

function getAssetDivs() {
  let table = document.evaluate("//div[contains(@class, 'ibbr-table-body--bordered')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  let divs = Array.from(table.snapshotItem(0).children);
  divs.shift(); divs.pop(); divs.pop(); // remove top and 2 bottom rows
  return divs;
}

function getDetailsRow(assetDiv) {
  return document.evaluate("//div[contains(@class, 'action-bar--buttons u-text-right')]", assetDiv, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
}

function getAssetName(detailsRow) {
  return document.evaluate("//div[contains(@class, 'gs-span-7 u-visible-lg u-text-faded u-text-left')]", detailsRow, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).children[0].innerText;
}

function xpToArray(xpresults) {
  let results = [];
  for (let i = 0, length = xpresults.snapshotLength; i < length; i++) {
    results.push(xpresults.snapshotItem(i));
  }
  return results;
}

function getAssetMarketValues() {
  let results = document.evaluate("//div[contains(@class, 'ibbr-table-cell--market-value')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  let divs = xpToArray(results);
  divs.shift(); divs.pop();
  return divs.map((div) => div.children[0].innerText);
}

function injectHarmoniserButton() {
  let results = document.evaluate("//ul[contains(@class, 'gs-span-16')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  const dom = results.snapshotItem(0);
  const element = el("li.gs-span-5",
                           el("a.link-default", text("Harmonise!"), {"data-micromodal-trigger": "harmoniser-dom", href: "javascript:;", style: "color: dodgerblue;"}));
  mount(dom, element, dom.firstChild);
}

function insertModalDom() {
  const content = el("#harmoniser-dom-content", text("Content!"));
  const closeButton = el("button", {"aria-label": "Close window", "data-micromodal-close": true});
  const header = el("header",
                          [el("h2.harmoniser-dom-title", text("Title text!")),
                           closeButton]);
  const contentDiv = el("div",
                              [header,
                               content],
                              {role: "dialog", "aria-model": true, "aria-labelled-by": "harmoniser-dom-title"});
  const middleDiv = el("div",
                             contentDiv,
                             {"data-micromodal-close": true, "tabindex": "-1"});
  const outerDev = el("#harmoniser-dom.modal",
                            middleDiv,
                            {"aria-hidden": true});
  mount(document.body, outerDev);
}

// window.injectHarmoniserButton = injectHarmoniserButton;
// window.insertModalDom = insertModalDom;

$(function() {
  insertModalDom();
  injectHarmoniserButton();
  MicroModal.init();
});

// window.getAssetMarketValues = getAssetMarketValues;

// console.log("Loaded harmoniser!")

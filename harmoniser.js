function visitDepot() {
  docs = document.evaluate("//a[text()='Depotbewertung']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  docs.snapshotItem(0).click();
};

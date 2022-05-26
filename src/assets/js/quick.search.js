const quickSearch = function () {
  const query = new URLSearchParams(window.location.search).get("q");
  if (query) {
    const searchInput = document.getElementById("searchInput");
    searchInput.value = decodeURIComponent(query);
    searchInput.dispatchEvent(new KeyboardEvent("keyup", { "key": searchInput.value.charAt(searchInput.value.length - 1) }));
  };
}

window.addEventListener("load", () => {
  // Hacky multi-threading.
  setTimeout(quickSearch, 0);
});

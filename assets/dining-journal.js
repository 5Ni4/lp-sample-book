"use strict";

const journalFilters = document.querySelector("[data-journal-filters]");

if (journalFilters) {
  const store = journalFilters.querySelector("[data-journal-store]");
  const category = journalFilters.querySelector("[data-journal-category]");
  const posts = [...document.querySelectorAll("[data-journal-post]")];
  const result = document.querySelector("[data-journal-result]");
  const empty = document.querySelector("[data-journal-empty]");

  function readFilters() {
    const params = new URLSearchParams(window.location.search);
    for (const select of [store, category]) {
      const value = params.get(select.name);
      select.value = [...select.options].some((option) => option.value === value) ? value : "all";
    }
  }

  function showPosts() {
    let count = 0;
    for (const post of posts) {
      const matchesStore = store.value === "all" || post.dataset.stores.split(" ").includes(store.value);
      const matchesCategory = category.value === "all" || post.dataset.category === category.value;
      post.hidden = !matchesStore || !matchesCategory;
      if (!post.hidden) count += 1;
    }
    result.textContent = count + "件の記事";
    empty.hidden = count !== 0;
  }

  journalFilters.addEventListener("submit", (event) => event.preventDefault());
  journalFilters.addEventListener("change", () => {
    const url = new URL(window.location.href);
    for (const select of [store, category]) {
      if (select.value === "all") url.searchParams.delete(select.name);
      else url.searchParams.set(select.name, select.value);
    }
    window.history.pushState(null, "", url);
    showPosts();
  });
  journalFilters.addEventListener("reset", () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("store");
    url.searchParams.delete("category");
    window.history.pushState(null, "", url);
    readFilters();
    showPosts();
  });
  window.addEventListener("popstate", () => {
    readFilters();
    showPosts();
  });
  readFilters();
  showPosts();
  journalFilters.hidden = false;
  result.hidden = false;
}

"use strict";

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    let visibleCount = 0;
    document.querySelectorAll(".sample-card[data-category]").forEach((card) => {
      const visible = selected === "all" || card.dataset.category === selected;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    const emptyState = document.querySelector("[data-empty-state]");
    if (emptyState) emptyState.hidden = visibleCount !== 0;
  });
});

document.querySelectorAll("[data-article-demo]").forEach((button) => {
  button.addEventListener("click", () => {
    const demo = button.closest("[data-workflow-demo]");
    if (!demo) return;
    const preview = demo.querySelector("[data-generated-preview]");
    const status = demo.querySelector("[data-demo-status]");
    if (preview) preview.hidden = false;
    if (status) status.textContent = "サンプル下書きを表示しました";
    button.textContent = "下書きを表示中";
    button.disabled = true;
  });
});

document.querySelectorAll("[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const notice = form.querySelector("[data-form-notice]");
    if (notice) notice.textContent = "デモフォームです。入力内容は送信・保存されていません。";
  });
});

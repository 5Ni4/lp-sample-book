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

document.querySelectorAll("[data-nail-order]").forEach((form) => {
  const design = form.querySelector("[data-nail-design]");
  const size = form.querySelector("[data-nail-size]");
  const count = form.querySelector("[data-nail-count]");
  const review = form.parentElement.querySelector("[data-nail-review]");
  const payment = review.querySelector("[data-nail-payment-preview]");
  const shipping = Number(form.dataset.shipping);
  const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" });

  function updateTotals() {
    const subtotal = Number(design.selectedOptions[0].dataset.price) * Number(count.value);
    form.querySelector("[data-nail-subtotal]").textContent = yen.format(subtotal);
    form.querySelector("[data-nail-shipping]").textContent = yen.format(shipping);
    const total = yen.format(subtotal + shipping);
    form.querySelector("[data-nail-total]").textContent = total;
    return total;
  }

  function hideReview() {
    review.hidden = true;
    payment.hidden = true;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    review.querySelector("[data-nail-review-design]").textContent = design.selectedOptions[0].textContent;
    review.querySelector("[data-nail-review-size]").textContent = size.value;
    review.querySelector("[data-nail-review-count]").textContent = count.selectedOptions[0].textContent;
    review.querySelector("[data-nail-review-total]").textContent = updateTotals();
    payment.hidden = true;
    review.hidden = false;
    review.querySelector("h3").focus();
  });

  form.addEventListener("change", () => {
    hideReview();
    updateTotals();
  });

  document.querySelectorAll("[data-nail-select]").forEach((link) => {
    link.addEventListener("click", () => {
      design.value = link.dataset.nailSelect;
      hideReview();
      updateTotals();
    });
  });

  review.querySelector("[data-nail-payment]").addEventListener("click", () => {
    payment.hidden = false;
    payment.querySelector("h4").focus();
  });

  review.querySelector("[data-nail-edit]").addEventListener("click", () => {
    hideReview();
    design.focus();
  });

  updateTotals();
  form.querySelector("fieldset").disabled = false;
});

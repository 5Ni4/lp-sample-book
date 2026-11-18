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

document.querySelectorAll("[data-line-preview]").forEach((preview) => {
  const thread = preview.querySelector("[data-line-thread]");
  const modeButtons = [...preview.querySelectorAll("[data-line-mode]")];
  const pickers = [...preview.querySelectorAll("[data-line-picker]")];
  const input = preview.querySelector("[data-line-text]");
  const draftPanel = preview.querySelector("[data-line-draft-panel]");
  const draft = preview.querySelector("[data-line-draft]");
  const send = preview.querySelector("[data-line-send]");
  const undo = preview.querySelector("[data-line-undo]");
  const feedback = preview.querySelector("[data-line-feedback]");
  const emojiChoices = [];

  function readDraft() {
    const text = input.value.trim();
    const layout = !text && emojiChoices.length <= 3 ? "emoji-row" : "bubble";
    return { text, items: emojiChoices, layout };
  }

  function renderMessage(target, {text, items, layout}) {
    target.dataset.lineLayout = layout;
    const contents = document.createDocumentFragment();
    if (text) contents.append(text);
    for (const item of items) {
      const image = item.querySelector("img").cloneNode();
      image.loading = "eager";
      image.alt = item.textContent.trim();
      contents.append(image);
    }
    target.replaceChildren(contents);
  }

  function updateDraft() {
    const message = readDraft();
    const empty = !message.text && !message.items.length;
    send.disabled = empty;
    draftPanel.hidden = empty;
    undo.hidden = !emojiChoices.length;

    if (empty) {
      delete draft.dataset.lineLayout;
      draft.replaceChildren();
      return;
    }
    renderMessage(draft, message);
  }

  function setMode(mode) {
    modeButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.lineMode === mode)));
    pickers.forEach((picker) => {
      picker.hidden = picker.dataset.linePicker !== mode;
    });
    feedback.textContent = "";
    updateDraft();
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.lineMode));
  });
  preview.querySelectorAll('[data-line-picker="sticker"] [data-line-item]').forEach((button) => {
    button.addEventListener("click", () => {
      feedback.textContent = "";
      sendMessage({ text: "", items: [button], layout: "sticker" });
    });
  });
  preview.querySelectorAll('[data-line-picker="emoji"] [data-line-item]').forEach((button) => {
    button.addEventListener("click", () => {
      if (emojiChoices.length >= 8) {
        feedback.textContent = "絵文字は一度に8個まで試せます";
        return;
      }
      emojiChoices.push(button);
      feedback.textContent = button.textContent.trim() + "を追加しました";
      updateDraft();
    });
  });

  input.addEventListener("input", updateDraft);
  undo.addEventListener("click", () => {
    const removed = emojiChoices.pop();
    feedback.textContent = "最後の絵文字を取り除きました";
    updateDraft();
    if (undo.hidden && removed) removed.focus({preventScroll: true});
  });

  function sendMessage(message) {
    const entry = document.createElement("li");
    entry.className = "line-preview__message line-preview__message--sent";
    entry.dataset.lineSent = "";
    const bubble = document.createElement("p");
    renderMessage(bubble, message);
    entry.append(bubble);
    thread.append(entry);
    thread.scrollTop = thread.scrollHeight;
    const bounds = entry.getBoundingClientRect();
    if (bounds.top < 0 || bounds.bottom > window.innerHeight) {
      entry.scrollIntoView({block: "nearest"});
    }
  }

  send.addEventListener("click", () => {
    const message = readDraft();
    if (!message.text && !message.items.length) return;
    sendMessage(message);
    input.value = "";
    emojiChoices.length = 0;
    feedback.textContent = "";
    updateDraft();
  });

  preview.querySelector("[data-line-reset]").addEventListener("click", () => {
    thread.querySelectorAll("[data-line-sent]").forEach((message) => message.remove());
    thread.scrollTop = 0;
    input.value = "";
    emojiChoices.length = 0;
    setMode("sticker");
    feedback.textContent = "最初の状態に戻しました";
  });

  updateDraft();
  preview.hidden = false;
});

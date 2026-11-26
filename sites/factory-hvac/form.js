document.querySelector('#contact').addEventListener('submit', event => {
  event.preventDefault();
  const result = document.querySelector('#result');
  result.hidden = false;
  result.textContent = '入力内容を確認しました。送信はしていません。';
});

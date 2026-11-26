document.querySelector('#contact').addEventListener('submit', event => {
  event.preventDefault();
  const result = document.querySelector('#result');
  result.hidden = false;
  result.textContent = '相談内容を確認しました。このサイトは作例のため、外部には送信されていません。';
});

const button = document.querySelector('#copy');
const status = document.querySelector('#copy-message');
button.addEventListener('click', async () => {
  const checklist = [...document.querySelectorAll('.sheet li')].map(li => '・'+li.textContent).join('\n');
  try {
    await navigator.clipboard.writeText(checklist);
    status.textContent = '準備リストをコピーしました。';
  } catch {
    status.textContent = 'コピーできませんでした。上の3項目を選んでコピーしてください。';
  }
});

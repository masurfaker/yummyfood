const form = document.getElementById('orderForm');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get('name');
  const contactMethod = formData.get('contactMethod');
  const contactHandle = formData.get('contactHandle');
  const comment = formData.get('comment');

  let fullOrder = '';
  form.querySelectorAll('input[type="number"]').forEach(input => {
    const quantity = parseInt(input.value);
    if (quantity > 0) {
      fullOrder += `${input.name} — ${quantity}\n`;
    }
  });

  if (!fullOrder.trim()) {
    alert('Пожалуйста, выберите хотя бы одно блюдо.');
    return;
  }

  const message = `${name}! Ваша заявка отправлена!\n\nВаш заказ:\n${fullOrder}\nВ ближайшее время с вами свяжутся.\nБлагодарим, что выбрали YUMMY!`;
  popupMessage.innerText = message;
  popup.classList.remove('hidden');

  // Отправка письма через Formspree или Web3Forms
  await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: '14d92358-9b7a-4e16-b2a7-35e9ed71de43',
      name,
      contactMethod,
      contactHandle,
      comment,
      fullOrder
    })
  });

  form.reset();
});

function closePopup() {
  popup.classList.add('hidden');
}
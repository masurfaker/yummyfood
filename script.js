
emailjs.init('u7NXPBbhemkcB7EGM');

document.getElementById('orderForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const name = formData.get("name");
  const email = formData.get("email");
  const contactType = formData.get("social");
  const contactValue = formData.get("contact");
  const comment = formData.get("comment");

  let filteredOrder = '';
  let fullOrder = '';
  let countTotal = 0;

  for (let [key, value] of formData.entries()) {
    if (['name', 'email', 'social', 'contact', 'comment'].includes(key)) continue;

    let val = parseInt(value || 0);
    fullOrder += `${key} — ${val}\n`;
    if (val > 0) {
      filteredOrder += `${key} — ${val}\n`;
      countTotal += val;
    }
  }

  if (countTotal < 10) {
    alert("Минимальное количество заказанных блюд: 10.");
    return;
  }

  const clientMessage = `
Здравствуйте, ${name}!

Спасибо за вашу заявку.

Ваш контакт для связи: ${contactType} — ${contactValue}

Вы выбрали:
${filteredOrder}

Комментарий: ${comment}

В ближайшее время с вами свяжутся.
`;

  // Отправка письма клиенту
  emailjs.send('service_p7e7ykn', 'admin_template', {
    name: name,
    email: email,
    contactMethod: contactType,
    contactHandle: contactValue,
    comment: comment,
    filteredOrder: filteredOrder,
    fullOrder: fullOrder,
    to_email: email
  });

  // Отправка письма администратору
  emailjs.send('service_p7e7ykn', 'admin_template', {
    name: name,
    email: email,
    contactMethod: contactType,
    contactHandle: contactValue,
    comment: comment,
    filteredOrder: filteredOrder,
    fullOrder: fullOrder,
    to_email: 'stassser@gmail.com'
  });

  const popup = document.getElementById('popup');
  popup.textContent = clientMessage;
  popup.style.display = 'block';
});

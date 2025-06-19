function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

document.getElementById("order-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = this.name.value.trim();
  const contactMethod = this.contactMethod.value;
  const contactHandle = this.contactHandle.value.trim();
  const comment = this.comment.value.trim();

  const formData = new FormData();

  formData.append("access_key", "14d92358-9b7a-4e16-b2a7-35e9ed71de43");
  formData.append("subject", "Новый заказ с сайта Yummy");

  let orderedItems = [];

  // Собираем все блюда с количеством
  const inputs = this.querySelectorAll("input[type='text']");
  inputs.forEach((input) => {
    const dish = input.name;
    const quantity = input.value.trim();
    if (quantity && parseInt(quantity) > 0) {
      orderedItems.push(`${dish} — ${quantity}`);
    }
  });

  if (orderedItems.length === 0) {
    alert("Выберите хотя бы одно блюдо.");
    return;
  }

  // Подготовка данных для письма
  const message = `
Имя: ${name}
Контакт: ${contactMethod} — ${contactHandle}
Комментарий: ${comment}

Состав заказа:
${orderedItems.join("\n")}
`;

  formData.append("name", name);
  formData.append("email", "stassser@gmail.com");
  formData.append("message", message);

  // Уведомление пользователю
  const popupMessage = `${name}! Ваша заявка отправлена!\n\nВаш заказ:\n${orderedItems.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\nВ ближайшее время с вами свяжутся.\nБлагодарим, что выбрали YUMMY!`;
  document.getElementById("popup-message").innerText = popupMessage;
  document.getElementById("popup").classList.remove("hidden");

  // Отправка на Web3Forms
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    if (result.success) {
      this.reset();
    } else {
      alert("Ошибка отправки: " + result.message);
    }
  } catch (error) {
    alert("Ошибка отправки формы.");
    console.error(error);
  }
});
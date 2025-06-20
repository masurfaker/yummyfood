document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const contactHandle = document.getElementById("contactHandle").value.trim();
  const contactMethod = document.getElementById("contactMethod").value;
  const comment = document.getElementById("comment").value.trim();

  if (!name || !contactHandle || !contactMethod) {
    alert("Пожалуйста, заполните все поля.");
    return;
  }

  const inputs = document.querySelectorAll(".dish-list input[type='number']");
  let orderedItems = [];

  inputs.forEach((input) => {
    const qty = parseInt(input.value);
    if (qty > 0) {
      orderedItems.push(`${input.name} — ${qty}`);
    }
  });

  if (orderedItems.length === 0) {
    alert("Пожалуйста, выберите хотя бы одно блюдо.");
    return;
  }

  const fullOrder = orderedItems.join("\n");

  // Подготовка письма
  const payload = {
    access_key: "14d92358-9b7a-4e16-b2a7-35e9ed71de43",
    name,
    contactHandle,
    contactMethod,
    comment,
    order: fullOrder,
    reply_to: "stassser@gmail.com",
  };

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("popup-message").innerText = `${name}! Ваша заявка отправлена!\n\nВаш заказ:\n${fullOrder}\n\nВ ближайшее время с вами свяжутся.\n\nБлагодарим, что выбрали YUMMY!`;
        document.getElementById("popup").style.display = "flex";
        document.getElementById("orderForm").reset();
      } else {
        alert("Ошибка при отправке. Повторите позже.");
      }
    })
    .catch(() => alert("Ошибка отправки. Проверьте подключение."));
});

function closePopup() {
  document.getElementById("popup").style.display = "none";
}
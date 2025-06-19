function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

document.getElementById("order-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = this.name.value.trim();
  const contactMethod = this.contactMethod.value;
  const contactHandle = this.contactHandle.value.trim();
  const comment = this.comment.value.trim();

  const formData = new FormData(this);
  const orderedItems = [];

  for (let [key, value] of formData.entries()) {
    if (["name", "contactMethod", "contactHandle", "comment"].includes(key)) continue;
    if (value && parseInt(value) > 0) {
      orderedItems.push(`${key} — ${value}`);
    }
  }

  if (orderedItems.length === 0) {
    alert("Выберите хотя бы одно блюдо.");
    return;
  }

  const message = `${name}! Ваша заявка отправлена!\n\nВаш заказ:\n${orderedItems.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\nВ ближайшее время с вами свяжутся.\nБлагодарим, что выбрали YUMMY!`;
  document.getElementById("popup-message").innerText = message;
  document.getElementById("popup").classList.remove("hidden");

  // Formspree
  fetch("https://formspree.io/f/your-form-id", {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: new FormData(this)
  }).catch((error) => {
    alert("Ошибка при отправке формы.");
    console.error(error);
  });

  this.reset();
});
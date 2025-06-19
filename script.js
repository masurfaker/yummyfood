function closePopup(){
  document.getElementById("popup").classList.add("hidden");
}

document.getElementById("orderForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name   = this.name.value.trim();
  const method = this.contactMethod.value;
  const handle = this.contactHandle.value.trim();
  const comment= this.comment.value.trim();

  const dishInputs = this.querySelectorAll(".dish input[type='number']");
  const ordered = [];
  dishInputs.forEach(inp => {
    const q = parseInt(inp.value) || 0;
    if (q > 0) ordered.push(`${inp.name} — ${q}`);
  });

  if (!ordered.length) {
    alert("Выберите хотя бы одно блюдо.");
    return;
  }

  const orderList = ordered.map((x,i)=>`${i+1}. ${x}`).join("\n");
  const emailText = `
Имя: ${name}
Контакт: ${method} — ${handle}
Комментарий: ${comment || "-"}
Состав заказа:
${orderList}`.trim();

  document.getElementById("popup-message").innerText =
    `${name}! Ваша заявка отправлена!\n\nВаш заказ:\n${orderList}\n\n`+
    `В ближайшее время с вами свяжутся.\nБлагодарим, что выбрали YUMMY!`;
  document.getElementById("popup").classList.remove("hidden");

  const payload = {
    access_key: "14d92358-9b7a-4e16-b2a7-35e9ed71de43",
    subject: "Новая заявка Yummy",
    name: name,
    email: "stassser@gmail.com",
    message: emailText
  };

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    }).then(r => r.json());

    if (!res.success) alert("Ошибка отправки: " + res.message);
    this.reset();
  } catch (err) {
    alert("Ошибка сети."); console.error(err);
  }
});
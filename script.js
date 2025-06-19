document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const f = e.target;
  const fd = new FormData(f);

  const name = fd.get("name").trim();
  const email = fd.get("email").trim();
  const contact_type = fd.get("contact_type");
  const contact_value = fd.get("contact_value").trim();
  const comment = fd.get("comment").trim();

  let full = "", filtered = "";
  let qty = 0;

  fd.forEach((v, k) => {
    if (!["name", "email", "contact_type", "contact_value", "comment"].includes(k)) {
      const n = parseInt(v) || 0;
      full += `${k} — ${n}\n`;
      if (n > 0) {
        filtered += `${k} — ${n}\n`;
        qty += n;
      }
    }
  });

  if (qty === 0) {
    alert("Выберите хотя бы одно блюдо");
    return;
  }

  const admin = { name, email, contact_type, contact_value, comment, Order: full };
  const client = { name, email, comment, contactMethod: contact_type, contactvalue: contact_value, filteredOrder: filtered };

  try {
    console.log("Отправка на admin:", admin);
    console.log("Отправка на client:", client);

    await emailjs.send("service_p7e7ykn", "template_admin", admin);
    await emailjs.send("service_p7e7ykn", "template_customer", client);

    const p = document.getElementById("popup");
    p.textContent = `${name}, спасибо за вашу заявку!\n\nКонтакт: ${contact_type} — ${contact_value}\n\nВы выбрали:\n${filtered}`;
    p.style.display = "block";
    f.reset();
    setTimeout(() => (p.style.display = "none"), 8000);

  } catch (err) {
    console.error("Ошибка EmailJS: ", err);
    alert(`Ошибка отправки: ${err.text || err.message || err}`);
  }
});
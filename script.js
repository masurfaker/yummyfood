document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("u7NXPBbhemkcB7EGM"); // Public Key

  const form = document.getElementById("order-form");
  const popup = document.getElementById("popup");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const comment = formData.get("comment");
    const contactMethod = formData.get("contact_method");
    const contactValue = formData.get("contact_value");

    let fullOrder = "";
    let filteredOrder = "";

    for (let [key, value] of formData.entries()) {
      if (["name", "email", "comment", "contact_method", "contact_value"].includes(key)) continue;
      const label = form.querySelector(`[name="${key}"]`).previousElementSibling.innerText;
      const line = `${label} — ${value}`;
      fullOrder += line + "\n";
      if (parseInt(value) > 0) filteredOrder += line + "\n";
    }

    const customerParams = {
      name: name,
      email: email,
      filteredOrder: filteredOrder,
      comment: comment,
      contact: `${contactMethod}: ${contactValue}`
    };

    const adminParams = {
      name: name,
      email: email,
      filteredOrder: fullOrder,
      comment: comment,
      contact: `${contactMethod}: ${contactValue}`
    };

    // Письмо клиенту
    emailjs.send("service_p7e7ykn", "template_customer", customerParams);

    // Письмо владельцу
    emailjs.send("service_p7e7ykn", "template_owner", adminParams);

    popup.innerText = `Спасибо за заказ, ${name}!\n\n${filteredOrder}`;
    popup.style.display = "block";

    setTimeout(() => {
      popup.style.display = "none";
    }, 6000);

    form.reset();
  });
});

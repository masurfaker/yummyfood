
document.getElementById("order-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const order = {};
    const filteredOrder = {};
    let hasItems = false;

    formData.forEach((value, key) => {
        if (key.startsWith("dish_")) {
            const name = key.replace("dish_", "");
            order[name] = value;
            if (parseInt(value) > 0) {
                filteredOrder[name] = value;
                hasItems = true;
            }
        } else {
            order[key] = value;
        }
    });

    if (!hasItems) {
        alert("Выберите хотя бы одно блюдо.");
        return;
    }

    const serviceID = "service_p7e7ykn";
    const templateAdmin = "template_admin"; // шаблон для тебя
    const templateClient = "template_client"; // шаблон для клиента
    const publicKey = "u7NXPBbhemkcB7EGM";

    // Отправка администратору (вся форма)
    emailjs.send(serviceID, templateAdmin, {
        name: order.name,
        email: order.email,
        contact_type: order.contact_type,
        contact_value: order.contact_value,
        order: JSON.stringify(order, null, 2),
        comment: order.comment || "—"
    }, publicKey).then(() => {
        console.log("Отправлено админу");
    }, (err) => {
        alert("Ошибка при отправке админу: " + JSON.stringify(err));
    });

    // Отправка клиенту (только отфильтрованные)
    emailjs.send(serviceID, templateClient, {
        name: order.name,
        email: order.email,
        contact_type: order.contact_type,
        contact_value: order.contact_value,
        filteredOrder: Object.entries(filteredOrder).map(
            ([k, v]) => `${k}: ${v}`
        ).join("\n"),
        comment: order.comment || "—"
    }, publicKey).then(() => {
        alert("Заявка отправлена успешно!");
        form.reset();
    }, (err) => {
        alert("Ошибка при отправке клиенту: " + JSON.stringify(err));
    });
});

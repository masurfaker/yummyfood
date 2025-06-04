document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    let hasSelection = false;
    let fullOrder = '';
    let filteredOrder = '';

    for (const [key, value] of formData.entries()) {
        if (!isNaN(value) && value !== '' && key !== 'name' && key !== 'email' && key !== 'comment' && key !== 'contact_type' && key !== 'contact_value') {
            const qty = parseInt(value);
            fullOrder += `${key}: ${qty}\n`;
            if (qty > 0) {
                hasSelection = true;
                filteredOrder += `${key}: ${qty}\n`;
            }
        }
    }

    if (!hasSelection) {
        alert('Выберите хотя бы одно блюдо.');
        return;
    }

    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        comment: formData.get('comment'),
        contact: `${formData.get('contact_type')}: ${formData.get('contact_value')}`,
        fullOrder,
        filteredOrder
    };

    emailjs.send('service_p7e7ykn', 'admin_template', data)
        .then(() => {
            return emailjs.send('service_p7e7ykn', 'client_template', data);
        })
        .then(() => {
            alert('Заявка успешно отправлена!');
            form.reset();
        })
        .catch(err => {
            console.error(err);
            alert('Ошибка при отправке. Попробуйте позже.');
        });
});
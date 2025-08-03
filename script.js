document.addEventListener('DOMContentLoaded', () => {
  alert("A: DOM загружен");

  try {
    document.querySelectorAll('select.qty').forEach(select => {
      alert("B: найден select");

      if (select.options.length === 0) {
        alert("C: options.length = 0, заполняем");

        for (let i = 0; i <= 6; i++) {
          const option = document.createElement('option');
          option.value = i;
          option.textContent = i;
          select.appendChild(option);
        }
      }

      select.addEventListener('change', updateKbjuTotal);
    });

    alert("D: Все select обработаны");

    updateKbjuTotal();
    alert("E: updateKbjuTotal вызван");
  } catch (e) {
    alert("Ошибка в JS: " + e.message);
  }
});
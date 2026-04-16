(async () => {
  const promotionSelect = document.getElementById('promotion-select');
  const tableBody = document.getElementById('all-time-table-body');
  const description = document.getElementById('promotion-description');

  const res = await fetch('data/all-time/promotions.json');
  const data = await res.json();

  data.promotions.forEach((promotion) => {
    const option = document.createElement('option');
    option.value = promotion.id;
    option.textContent = promotion.name;
    promotionSelect.append(option);
  });

  function renderPromotion(promotionId) {
    const promotion = data.promotions.find((item) => item.id === promotionId);
    tableBody.innerHTML = '';

    promotion.ranking.forEach((entry) => {
      const row = document.createElement('tr');
      const breakdown = Object.entries(entry.breakdown)
        .map(([key, value]) => {
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (char) => char.toUpperCase());
          return `${label}: ${value}`;
        })
        .join(', ');

      row.innerHTML = `
        <td>${entry.rank}</td>
        <td>${entry.name}</td>
        <td>${entry.score}</td>
        <td>${breakdown}</td>
      `;
      tableBody.append(row);
    });

    description.textContent = `${promotion.description} Last updated: ${promotion.updatedAt}.`;
  }

  promotionSelect.addEventListener('change', () => renderPromotion(promotionSelect.value));

  if (data.promotions.length > 0) {
    renderPromotion(data.promotions[0].id);
  }
})();

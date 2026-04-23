(async () => {
  const promotionSelect = document.getElementById('promotion-select');
  const tableBody = document.getElementById('all-time-table-body');
  const description = document.getElementById('promotion-description');
  const errorText = document.getElementById('all-time-error');

  function buildCell(value) {
    const cell = document.createElement('td');
    cell.textContent = value == null ? '' : String(value);
    return cell;
  }

  function renderPromotion(promotionId, data) {
    const promotion = data.promotions.find((item) => item.id === promotionId) || data.promotions[0];
    tableBody.innerHTML = '';

    if (!promotion) {
      description.textContent = 'No promotion data available.';
      return;
    }

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

      row.append(buildCell(entry.rank));
      row.append(buildCell(entry.name));
      row.append(buildCell(entry.score));
      row.append(buildCell(breakdown));
      tableBody.append(row);
    });

    description.textContent = `${promotion.description} Last updated: ${promotion.updatedAt}.`;
  }

  try {
    const res = await fetch('data/all-time/promotions.json');
    if (!res.ok) {
      throw new Error(`Failed to load all-time promotions (${res.status})`);
    }

    const data = await res.json();

    data.promotions.forEach((promotion) => {
      const option = document.createElement('option');
      option.value = promotion.id;
      option.textContent = promotion.name;
      promotionSelect.append(option);
    });

    promotionSelect.addEventListener('change', () => renderPromotion(promotionSelect.value, data));

    if (data.promotions.length > 0) {
      renderPromotion(data.promotions[0].id, data);
    } else {
      description.textContent = 'No promotion data available.';
    }
  } catch (error) {
    errorText.hidden = false;
    errorText.textContent = 'Could not load all-time promotion data.';
    console.error(error);
  }
})();

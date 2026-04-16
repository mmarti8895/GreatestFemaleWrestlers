(async () => {
  const yearSelect = document.getElementById('year-select');
  const searchInput = document.getElementById('search-input');
  const tableBody = document.getElementById('pwi-table-body');
  const yearMeta = document.getElementById('year-meta');
  const emptyText = document.getElementById('pwi-empty');

  const indexRes = await fetch('data/pwi/index.json');
  const index = await indexRes.json();

  index.years.forEach((yearInfo) => {
    const option = document.createElement('option');
    option.value = yearInfo.file;
    option.textContent = `${yearInfo.year} (${yearInfo.listName})`;
    yearSelect.append(option);
  });

  let currentEntries = [];
  let currentMeta = null;

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = currentEntries.filter((entry) => {
      return `${entry.name} ${entry.promotion}`.toLowerCase().includes(query);
    });

    tableBody.innerHTML = '';
    filtered.forEach((entry) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.rank}</td>
        <td>${entry.name}</td>
        <td>${entry.promotion}</td>
        <td>${entry.notes || ''}</td>
      `;
      tableBody.append(row);
    });

    emptyText.hidden = filtered.length !== 0;

    if (currentMeta) {
      yearMeta.textContent = `${currentMeta.listName}: showing ${currentMeta.entriesIncluded} of ${currentMeta.fullListSize}. See Sources for attribution.`;
    }
  }

  async function loadYear(fileName) {
    const selected = index.years.find((yearInfo) => yearInfo.file === fileName);
    const res = await fetch(`data/pwi/${fileName}`);
    const data = await res.json();
    currentEntries = data.entries;
    currentMeta = selected;
    render();
  }

  yearSelect.addEventListener('change', () => loadYear(yearSelect.value));
  searchInput.addEventListener('input', render);

  if (index.years.length > 0) {
    await loadYear(index.years[0].file);
  }
})();

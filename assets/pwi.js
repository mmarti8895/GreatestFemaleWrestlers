(async () => {
  const yearSelect = document.getElementById('year-select');
  const searchInput = document.getElementById('search-input');
  const tableBody = document.getElementById('pwi-table-body');
  const yearMeta = document.getElementById('year-meta');
  const emptyText = document.getElementById('pwi-empty');
  const errorText = document.getElementById('pwi-error');

  let index = { years: [] };
  let currentEntries = [];
  let currentMeta = null;

  function buildCell(value) {
    const cell = document.createElement('td');
    cell.textContent = value == null ? '' : String(value);
    return cell;
  }

  function setError(message) {
    errorText.hidden = false;
    errorText.textContent = message;
  }

  function clearError() {
    errorText.hidden = true;
    errorText.textContent = '';
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = currentEntries.filter((entry) => {
      return `${entry.name || ''} ${entry.promotion || ''}`.toLowerCase().includes(query);
    });

    tableBody.innerHTML = '';
    filtered.forEach((entry) => {
      const row = document.createElement('tr');
      row.append(buildCell(entry.rank));
      row.append(buildCell(entry.name));
      row.append(buildCell(entry.promotion));
      row.append(buildCell(entry.notes));
      tableBody.append(row);
    });

    emptyText.hidden = filtered.length !== 0;

    if (currentMeta) {
      yearMeta.textContent = `${currentMeta.listName}: showing ${currentMeta.entriesIncluded} of ${currentMeta.fullListSize}. See Sources for attribution.`;
    }
  }

  async function loadYear(fileName) {
    try {
      const selected = index.years.find((yearInfo) => yearInfo.file === fileName);
      if (!selected) {
        throw new Error('Requested year is not available.');
      }

      const res = await fetch(`data/pwi/${fileName}`);
      if (!res.ok) {
        throw new Error(`Failed to load ${fileName} (${res.status})`);
      }

      const data = await res.json();
      currentEntries = Array.isArray(data.entries) ? data.entries : [];
      currentMeta = selected;
      clearError();
      render();
    } catch (error) {
      currentEntries = [];
      currentMeta = null;
      tableBody.innerHTML = '';
      yearMeta.textContent = '';
      emptyText.hidden = true;
      setError('Could not load PWI data for the selected year.');
      console.error(error);
    }
  }

  try {
    const indexRes = await fetch('data/pwi/index.json');
    if (!indexRes.ok) {
      throw new Error(`Failed to load PWI index (${indexRes.status})`);
    }
    index = await indexRes.json();

    index.years.forEach((yearInfo) => {
      const option = document.createElement('option');
      option.value = yearInfo.file;
      option.textContent = `${yearInfo.year} (${yearInfo.listName})`;
      yearSelect.append(option);
    });

    yearSelect.addEventListener('change', () => loadYear(yearSelect.value));
    searchInput.addEventListener('input', render);

    if (index.years.length > 0) {
      await loadYear(index.years[0].file);
    } else {
      setError('No PWI data is available yet.');
    }
  } catch (error) {
    setError('Could not load PWI index data.');
    console.error(error);
  }
})();

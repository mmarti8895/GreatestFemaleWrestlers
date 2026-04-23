(async () => {
  const list = document.getElementById('sources-list');
  const errorText = document.getElementById('sources-error');

  try {
    const res = await fetch('data/sources.json');
    if (!res.ok) {
      throw new Error(`Failed to load sources (${res.status})`);
    }

    const data = await res.json();

    data.sources.forEach((source) => {
      const li = document.createElement('li');

      const title = document.createElement('strong');
      title.textContent = source.title || '';

      const link = document.createElement('a');
      link.href = source.url || '#';
      link.textContent = source.url || '';

      li.append(title);
      li.append(document.createTextNode(' — '));
      li.append(link);
      li.append(document.createElement('br'));
      li.append(document.createTextNode(source.notes || ''));
      list.append(li);
    });
  } catch (error) {
    errorText.hidden = false;
    errorText.textContent = 'Could not load source data.';
    console.error(error);
  }
})();

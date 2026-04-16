(async () => {
  const list = document.getElementById('sources-list');
  const res = await fetch('data/sources.json');
  const data = await res.json();

  data.sources.forEach((source) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${source.title}</strong> — <a href="${source.url}">${source.url}</a><br>${source.notes}`;
    list.append(li);
  });
})();

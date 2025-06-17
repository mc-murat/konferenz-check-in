async function checkIn() {
  const response = await fetch('http://<EURE_CAMUNDA_ENGINE>/engine-rest/process-definition/key/checkin/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variables: {} })
  });
  alert('Check-in erfolgreich!');
}

// Optional: Besucherzahl laden
fetch('http://<EURE_CAMUNDA_ENGINE>/engine-rest/variable/besucherzahl')
  .then(res => res.json())
  .then(data => {
    document.getElementById('status').textContent = `${data.value} / 200`;
  });

const camundaBaseUrl = 'https://camunda-production-55a3.up.railway.app/engine-rest';

// Teilnehmerzahl laden und anzeigen (Anzahl beendeter Check-In-Prozesse)
async function ladeTeilnehmerzahl() {
  try {
    const res = await fetch(`${camundaBaseUrl}/history/process-instance?processDefinitionKey=checkin&finished=true`);
    const instances = await res.json();
    const count = instances.length;
    document.getElementById('status').innerText = `${count} / 200 eingecheckt.`;
  } catch (e) {
    document.getElementById('status').innerText = 'Teilnehmerzahl konnte nicht geladen werden.';
  }
}

// Button-Click: Prozess starten
document.getElementById('checkInButton').addEventListener('click', async () => {
  try {
    await fetch(`${camundaBaseUrl}/process-definition/key/checkin/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    document.getElementById('status').innerText = 'Bitte Formular in der Prozess Engine ausfüllen!';
  } catch (e) {
    document.getElementById('status').innerText = 'Fehler beim Starten des Check-Ins!';
  }
});

// Automatisch alle 3 Sekunden Teilnehmerzahl aktualisieren
window.onload = () => {
  ladeTeilnehmerzahl();
  setInterval(ladeTeilnehmerzahl, 3000);
};

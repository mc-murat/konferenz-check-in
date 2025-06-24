const camundaBaseUrl = "https://camunda-checkin.onrender.com/engine-rest";

// Holt die aktuelle Teilnehmeranzahl von der Camunda-Engine
async function ladeTeilnehmerzahl() {
  try {
    const res = await fetch(${camundaBaseUrl}/variable/besucherzahl);
    const data = await res.json();
    document.getElementById("status").textContent = ${data.value} / 200;
  } catch (err) {
    console.error("Fehler beim Laden der Teilnehmerzahl:", err);
    document.getElementById("status").textContent = "nicht verfügbar";
  }
}

// Beim Laden der Seite automatisch ausführen
ladeTeilnehmerzahl();

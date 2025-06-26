const camundaBaseUrl = "https://camunda-production-55a3.up.railway.app/engine-rest";
const processKey = "checkin"; // exakt wie in deinem BPMN gesetzt

async function checkIn() {
  try {
    const response = await fetch(
      `${camundaBaseUrl}/process-definition/key/${processKey}/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          variables: {
            besucherzahl: {
              value: 0,
              type: "Integer"
            }
          }
        })
      }
    );

    if (response.ok) {
      alert("Check-in erfolgreich!");
      ladeTeilnehmerzahl();
    } else {
      const errorText = await response.text();
      console.error("Fehler beim Prozessstart:", errorText);
      alert("Check-in fehlgeschlagen.");
    }
  } catch (err) {
    console.error("Verbindungsfehler:", err);
    alert("Camunda nicht erreichbar.");
  }
}

async function ladeTeilnehmerzahl() {
  try {
    const instanceRes = await fetch(
      `${camundaBaseUrl}/process-instance?processDefinitionKey=${processKey}`
    );
    const instances = await instanceRes.json();

    if (instances.length === 0) {
      document.getElementById("status").textContent = "0 / 200";
      return;
    }

    const letzteInstanzId = instances[instances.length - 1].id;

    const res = await fetch(
      `${camundaBaseUrl}/process-instance/${letzteInstanzId}/variables/besucherzahl`
    );
    const data = await res.json();

    document.getElementById("status").textContent = `${data.value} / 200`;
  } catch (err) {
    console.error("Fehler beim Laden der Teilnehmerzahl:", err);
    document.getElementById("status").textContent = "Nicht verfügbar";
  }
}

window.onload = ladeTeilnehmerzahl;

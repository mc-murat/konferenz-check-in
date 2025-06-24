const camundaBaseUrl = "https://camunda-checkin.onrender.com/engine-rest";
const processKey = "checkin"; // Passe diesen Key an deinen Prozessnamen an!

// Funktion zum Starten des Prozesses bei Buttonklick
async function checkIn() {
  try {
    const response = await fetch(${camundaBaseUrl}/process-definition/key/${processKey}/start, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        variables: {}
      })
    });

    if (response.ok) {
      alert("Check-in erfolgreich!");
      ladeTeilnehmerzahl(); // gleich aktualisieren
    } else {
      const errorText = await response.text();
      console.error("Fehler beim Starten des Prozesses:", errorText);
      alert("Fehler beim Check-in.");
    }
  } catch (err) {
    console.error("Verbindungsfehler:", err);
    alert("Server nicht erreichbar.");
  }
}

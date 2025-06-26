const camundaBaseUrl = "https://camunda-production-55a3.up.railway.app/engine-rest";
const processKey = "checkin"; // exakt wie in deinem BPMN gesetzt

async function getMaxBesucherzahl() {
  const res = await fetch("https://camunda-production-55a3.up.railway.app/engine-rest/process-instance?processDefinitionKey=checkin");
  const instances = await res.json();
  let max = 0;

  for (const inst of instances) {
    try {
      const varRes = await fetch(
        `https://camunda-production-55a3.up.railway.app/engine-rest/process-instance/${inst.id}/variables/besucherzahl`
      );
      if (varRes.ok) {
        const varData = await varRes.json();
        if (typeof varData.value === "number" && varData.value > max) {
          max = varData.value;
        }
      }
    } catch (err) {
      // kann ignoriert werden
    }
  }
  return max;
}

async function checkIn() {
  let aktuelleZahl = await getMaxBesucherzahl();
  aktuelleZahl = aktuelleZahl + 1;

  const response = await fetch(
    "https://camunda-production-55a3.up.railway.app/engine-rest/process-definition/key/checkin/start",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        variables: {
          besucherzahl: { value: aktuelleZahl, type: "Integer" }
        }
      })
    }
  );

  if (response.ok) {
    document.getElementById("status").innerText = "Check-In erfolgreich!";
    ladeTeilnehmerzahl(); // zeigt direkt neue Zahl an
  } else {
    document.getElementById("status").innerText = "Fehler beim Check-In!";
    console.error(await response.text());
  }
}


async function ladeTeilnehmerzahl() {
  let maxBesucher = await getMaxBesucherzahl();
  document.getElementById("status").textContent = `${maxBesucher} / 200`;
}

window.onload = ladeTeilnehmerzahl;

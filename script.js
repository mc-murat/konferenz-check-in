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

async function startCheckIn() {
  document.getElementById("status").innerText = "Lädt... Bitte warten Sie auf die Bestätigung.";

  // Prozess starten
  const startResponse = await fetch("https://camunda-production-55a3.up.railway.app/engine-rest/process-definition/key/checkin/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  const processInstance = await startResponse.json();
  const instanceId = processInstance.id;

  // Polling starten, ob UserTask erledigt wurde
  const intervalId = setInterval(async () => {
    const tasksResponse = await fetch(`https://camunda-production-55a3.up.railway.app/engine-rest/task?processInstanceId=${instanceId}`);
    const tasks = await tasksResponse.json();

    if (tasks.length === 0) {
      clearInterval(intervalId);
      document.getElementById("status").innerText = "Check-In erfolgreich!";
      ladeTeilnehmerzahl();
    } else {
      document.getElementById("status").innerText = "Bitte bestätigen Sie den Check-In im Camunda Cockpit.";
    }
  }, 2000);
}


async function ladeTeilnehmerzahl() {
  const res = await fetch("https://camunda-production-55a3.up.railway.app/engine-rest/history/process-instance?processDefinitionKey=checkin");
  const instances = await res.json();
  let max = 0;

  for (const inst of instances) {
    try {
      const varRes = await fetch(`https://camunda-production-55a3.up.railway.app/engine-rest/history/variable-instance?processInstanceId=${inst.id}&variableName=besucherzahl`);
      const varData = await varRes.json();
      if (varData.length > 0 && varData[0].value > max) {
        max = varData[0].value;
      }
    } catch {}
  }
  document.getElementById("status").textContent = `${max} / 200`;
}
window.onload = ladeTeilnehmerzahl;

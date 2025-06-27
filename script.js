let pollingIntervalId = null;
let currentProcessInstanceId = null;
let lastStatus = "";

async function startCheckIn() {
  updateStatus("Lädt... Bitte warten Sie auf die Bestätigung.");

  if (pollingIntervalId) {
    clearInterval(pollingIntervalId);
    pollingIntervalId = null;
  }

  const startResponse = await fetch("https://camunda-production-55a3.up.railway.app/engine-rest/process-definition/key/checkin/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  const processInstance = await startResponse.json();

  currentProcessInstanceId = processInstance.id;

  pollingIntervalId = setInterval(async () => {
    const tasksResponse = await fetch(`https://camunda-production-55a3.up.railway.app/engine-rest/task?processInstanceId=${currentProcessInstanceId}`);
    const tasks = await tasksResponse.json();

    if (tasks.length === 0) {
      clearInterval(pollingIntervalId);
      pollingIntervalId = null;
      updateStatus("Check-In erfolgreich!");
      setTimeout(() => ladeTeilnehmerzahl(), 1500);
    } else {
      updateStatus("Bitte bestätigen Sie den Check-In im Camunda Cockpit.");
    }
  }, 2000);
}

function updateStatus(text) {
  if (lastStatus !== text) {
    lastStatus = text;
    document.getElementById("status").innerText = text;
  }
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
    } catch (e) {
      console.error("Fehler beim Variablenladen", e);
    }
  }
  document.getElementById("status").textContent = `${max} / 200`;
}

window.onload = ladeTeilnehmerzahl;

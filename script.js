let processInstanceId = null;

async function startProcess() {
  const response = await fetch('https://camunda-production-55a3.up.railway.app/engine-rest/process-definition/key/checkin/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  const data = await response.json();
  return data.id;
}

async function sendCheckInMessage(processInstanceId) {
  await fetch('https://camunda-production-55a3.up.railway.app/engine-rest/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messageName: 'CheckInButtonClicked',
      processInstanceId: processInstanceId
    })
  });
}

async function ladeTeilnehmerzahl() {
  const res = await fetch('https://camunda-production-55a3.up.railway.app/engine-rest/history/process-instance?processDefinitionKey=checkin');
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
  document.getElementById('status').innerText = `${max} / 200`;
}

document.getElementById('checkInButton').addEventListener('click', async () => {
  if (!processInstanceId) {
    processInstanceId = await startProcess();
  }
  await sendCheckInMessage(processInstanceId);
  document.getElementById('status').innerText = 'Bitte Formular im Camunda Cockpit bestätigen...';
});

window.onload = ladeTeilnehmerzahl;

// --- Modo selector ---
document.getElementById('btnQR').addEventListener('click', () => {
  document.getElementById('modoQR').style.display = 'block';
  document.getElementById('modoManual').style.display = 'none';
});
document.getElementById('btnManual').addEventListener('click', () => {
  document.getElementById('modoQR').style.display = 'none';
  document.getElementById('modoManual').style.display = 'block';
});

// --- Escáner QR ---
function onScanSuccess(decodedText) {
  document.getElementById('resultadoQR').innerHTML = `Código detectado: ${decodedText}`;
  registrarAsistencia(decodedText);
}

function registrarAsistencia(codigo) {
  fetch('registrar.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'codigo=' + encodeURIComponent(codigo)
  })
  .then(r => r.text())
  .then(t => document.getElementById('resultadoQR').innerHTML = t);
}

// Inicia el escáner
let scanner = new Html5Qrcode("reader");
scanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  onScanSuccess
);

// --- Registro Manual ---
function registrarManual() {
  let codigo = document.getElementById('codigo').value.trim();
  if (codigo === "") {
    document.getElementById('mensajeManual').innerHTML = "⚠️ Ingresa un código.";
    return;
  }
  fetch('registrar.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'codigo=' + encodeURIComponent(codigo)
  })
  .then(r => r.text())
  .then(t => {
    document.getElementById('mensajeManual').innerHTML = t;
    document.getElementById('codigo').value = "";
  });
}

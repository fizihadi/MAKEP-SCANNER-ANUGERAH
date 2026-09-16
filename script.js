const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxHTMWa_IEKX4954LuBJm9jacuFEs5g5-UV_qxs5KAYot1ro1c2Ek_6bkkwlHIWheYVCg/exec";
let isScanning = true;

function onScanSuccess(scannedCode) {
  if (!isScanning) return;
  isScanning = false;

  let logDiv = document.getElementById('log');
  let doneBtn = document.getElementById('doneBtn');
  let successSound = document.getElementById('successSound');

  logDiv.style.color = "#ffd700"; // Yellow
  logDiv.innerText = "Mengesahkan Kehadiran..";

  fetch(GOOGLE_SCRIPT_URL + "?action=scan&code=" + encodeURIComponent(scannedCode))
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // 🔊 Play Audio 
        if (successSound) {
          successSound.currentTime = 0; 
          successSound.play().catch(err => console.log("Audio play blocked by browser:", err));
        }

        logDiv.style.color = "#00ff66"; // Green
        logDiv.innerText = "Hadir: " + data.name + "\n" + " Kerusi: " + (data.opsyen || "-");
        
        // Tunjuk Butang Done
        doneBtn.style.display = "block";
      } else {
        logDiv.style.color = "#ff4444"; // Red
        logDiv.innerText = "❌ QR kod tidak sah!";
        
        // Reset scanner automatically if invalid
        setTimeout(resetScanner, 3000);
      }
    })
    .catch(err => {
      logDiv.style.color = "#ff4444";
      logDiv.innerText = "Error: " + err.message;
      setTimeout(resetScanner, 3000);
    });
}

function resetScanner() {
  let logDiv = document.getElementById('log');
  let doneBtn = document.getElementById('doneBtn');

  logDiv.style.color = "#ffffff";
  logDiv.innerText = "Sedia untuk imbasan seterusnya";
  doneBtn.style.display = "none";
  
  isScanning = true;
}

// ⌨️ Press 'Enter' key to clear current scan and get ready for next student
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    let doneBtn = document.getElementById('doneBtn');
    if (doneBtn && doneBtn.style.display === "block") {
      resetScanner();
    }
  }
});

let html5QrcodeScanner = new Html5QrcodeScanner(
  "reader", 
  { 
    fps: 10, 
    qrbox: { width: 250, height: 250 } 
  }, 
  false
);

html5QrcodeScanner.render(onScanSuccess);
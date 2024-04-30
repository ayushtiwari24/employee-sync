const ws = new WebSocket("ws://localhost:3000");
const logContainer = document.getElementById("log");
let currentBatch = 0;

ws.onopen = () => {
  console.log("Connected to server");
  logContainer.innerHTML = "API sync process is ongoing...";
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  // Increment current batch number
  currentBatch++;

  // Generate HTML for current batch results
  const batchHTML = generateBatchHTML(currentBatch, data);
  logContainer.innerHTML += batchHTML;
};

// Function to generate HTML for batch results
function generateBatchHTML(batchNumber, data) {
  let batchHTML = `
    <h2>Batch ${batchNumber} Results</h2>
    <p>New Records Added: ${data.newCount}</p>
    <p>Existing Records: ${data.existingCount}</p>
    <p>Updated Records: ${data.updatedCount}</p>
    <p>Errors Encountered: ${data.errorCount}</p>
  `;

  // Display updated records for the current batch
  if (data.updatedRecords.length > 0) {
    batchHTML += `<h3>Updated Records</h3>`;
    data.updatedRecords.forEach((updatedRecord) => {
      batchHTML += `<p>Record ID: ${updatedRecord.record.id}</p>`;
      for (const [field, value] of Object.entries(
        updatedRecord.updatedFields
      )) {
        batchHTML += `<p>${field}: ${value}</p>`;
      }
    });
  }

  // Display errors for the current batch
  if (data.errors.length > 0) {
    batchHTML += `<h3>Errors Encountered</h3>`;
    data.errors.forEach((error) => {
      batchHTML += `<p>${error}</p>`;
    });
  }

  return batchHTML;
}

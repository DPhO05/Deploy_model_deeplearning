// Lấy phần tử canvas và ngữ cảnh vẽ
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Các biến vẽ
let isDrawing = false;
let lastX = 0, lastY = 0;

// Hàm bắt đầu vẽ
function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Hàm vẽ
function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = '#fff';  // Màu mực là trắng
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Hàm dừng vẽ
function stopDrawing() {
  isDrawing = false;
}

// Xóa canvas
document.getElementById('clearButton').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('result').textContent = 'Kết quả dự đoán sẽ hiển thị ở đây.';  // Xóa kết quả dự đoán
});

// Gửi dữ liệu để dự đoán
document.getElementById('predictButton').addEventListener('click', async () => {
  const dataURL = canvas.toDataURL(); // Lấy ảnh dưới dạng Base64
  const response = await fetch('http://127.0.0.1:5000/predict', {  
    method: 'POST',
    body: JSON.stringify({ image: dataURL }),
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await response.json(); // Nhận kết quả từ server
  if (result.error) {
    document.getElementById('result').textContent = `Lỗi: ${result.error}`;
    document.getElementById('probabilities').innerHTML = '';
  } else {
    // Hiển thị lớp dự đoán
    document.getElementById('result').textContent = `Dự đoán: ${result.prediction}`;
    
    // Hiển thị xác suất của từng lớp
    const probs = result.probabilities;
      const maxProb = Math.max(...probs);
      const minProb = Math.min(...probs);

      // Xác định màu sắc cho mỗi xác suất
      const colorHue = 120; // Màu xanh dương (0 đến 360)
      const probRange = maxProb - minProb || 1; // Tránh chia cho 0

      // Tạo bố cục bảng 4x3
      const digitLayout = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['x', 0, 'x']
      ];

      let gridHTML = '';
      for (let row of digitLayout) {
        for (let digit of row) {
          if (digit === 'x') {
            // Ô trống
            gridHTML += `<div class="probability-box" style="visibility: hidden;"></div>`;
          } else {
            const prob = probs[digit] || 0;

            // Tính độ đậm nhạt dựa trên xác suất
            const normalizedProb = (prob - minProb) / probRange;
            const lightness = 30 + (1 - normalizedProb) * 50; // Giá trị từ 30% đến 80%
            const color = `hsl(${colorHue}, 100%, ${lightness}%)`;

            gridHTML += `
              <div class="probability-box" style="background-color: ${color};">
                <span>${digit}</span>
                <p>${(prob * 100).toFixed(2)}%</p>
              </div>
            `;
          }
        }
      }

      document.getElementById('probabilities-grid').innerHTML = gridHTML;
  }
});

// Thêm các sự kiện vẽ
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

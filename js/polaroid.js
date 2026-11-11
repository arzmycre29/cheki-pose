/**
 * Instax Mini Polaroid Frame Generator
 * Menggambar frame polaroid retro di HTML5 Canvas dan mengekspor gambar HD
 */

export class PolaroidStudio {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
  }

  setCanvas(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
  }

  async generate(options = {}) {
    if (!this.canvas || !this.ctx) return;

    const {
      title = "Half Heart",
      oshiName = "Oshi-chan",
      date = new Date().toISOString().split('T')[0],
      note = "2-Shot Cheki Event 💖",
      svgString = null,
      customImage = null,
      themeColor = "#FF6584"
    } = options;

    const width = 600;
    const height = 960; // Rasio Instax Mini ~ 54mm x 86mm
    this.canvas.width = width;
    this.canvas.height = height;
    const ctx = this.ctx;

    // 1. Polaroid Outer Frame (Kertas Foto Glossy Putih Gading)
    ctx.fillStyle = "#FAF8F5";
    ctx.fillRect(0, 0, width, height);

    // Subtle drop shadow / border
    ctx.strokeStyle = "#E5E0D8";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);

    // 2. Photo Area (Area Gambar Film)
    // Instax Mini Photo Dimension: 46mm x 62mm
    const photoX = 45;
    const photoY = 45;
    const photoW = width - 90;
    const photoH = 680;

    // Foto Background gradient
    const bgGrad = ctx.createLinearGradient(photoX, photoY, photoX, photoY + photoH);
    bgGrad.addColorStop(0, "#FFF0F3");
    bgGrad.addColorStop(1, "#FFE3EB");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(photoX, photoY, photoW, photoH);

    // Inner dark border around photo
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 3;
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    // 3. Render Content (Custom Photo or SVG Diagram)
    if (customImage) {
      await this.drawImageCover(ctx, customImage, photoX, photoY, photoW, photoH);
    } else if (svgString) {
      await this.drawSvg(ctx, svgString, photoX, photoY, photoW, photoH);
    }

    // Header badge inside photo
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.beginPath();
    ctx.roundRect(photoX + 20, photoY + 20, 220, 42, 21);
    ctx.fill();
    ctx.fillStyle = themeColor;
    ctx.font = "bold 18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("📷 CHEKI POSE", photoX + 45, photoY + 47);

    // 4. Bottom Margin (Area Tulis Spidol)
    const textStartY = photoY + photoH + 50;

    // Oshi Name (Spidol Bold)
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 34px 'Mochiy Pop One', 'Fredoka', cursive, sans-serif";
    ctx.fillText(oshiName, photoX + 10, textStartY + 30);

    // Pose Title
    ctx.fillStyle = themeColor;
    ctx.font = "bold 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("✨ " + title, photoX + 10, textStartY + 72);

    // Date & Memo
    ctx.fillStyle = "#64748B";
    ctx.font = "500 18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`📅 ${date} • ${note}`, photoX + 10, textStartY + 115);

    // Cute Instax Stamp icon on right bottom
    ctx.fillStyle = "rgba(255, 101, 132, 0.15)";
    ctx.beginPath();
    ctx.arc(width - 95, textStartY + 70, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FF6584";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("チェキ", width - 95, textStartY + 78);
    ctx.textAlign = "left"; // reset
  }

  drawSvg(ctx, svgStr, x, y, w, h) {
    return new Promise((resolve) => {
      const img = new Image();
      const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Center the SVG diagram inside the photo area
        const padding = 20;
        ctx.drawImage(img, x + padding, y + padding + 60, w - (padding * 2), h - (padding * 2) - 80);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      img.src = url;
    });
  }

  drawImageCover(ctx, imgSrc, x, y, w, h) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();

        const imgRatio = img.width / img.height;
        const targetRatio = w / h;
        let dw, dh, dx, dy;

        if (imgRatio > targetRatio) {
          dh = h;
          dw = h * imgRatio;
          dx = x - (dw - w) / 2;
          dy = y;
        } else {
          dw = w;
          dh = w / imgRatio;
          dx = x;
          dy = y - (dh - h) / 2;
        }

        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = imgSrc;
    });
  }

  download(filename = "cheki-pose-plan.png") {
    if (!this.canvas) return;
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}

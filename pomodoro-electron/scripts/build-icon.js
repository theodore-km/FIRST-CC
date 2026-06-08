const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const SVG_PATH = path.join(ROOT, 'assets', 'icon.svg');
const OUT_DIR = path.join(ROOT, 'build');
const OUT_PNG = path.join(OUT_DIR, 'icon.png');

async function buildIcon() {
  // 确保 build 目录存在
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const svgBuffer = fs.readFileSync(SVG_PATH);

  // 生成 256x256 PNG（electron-builder 会自动转为 .ico）
  await sharp(svgBuffer)
    .resize(256, 256)
    .png()
    .toFile(OUT_PNG);

  console.log('✅ 图标已生成:', OUT_PNG);

  // 验证文件大小
  const stats = fs.statSync(OUT_PNG);
  console.log(`   文件大小: ${(stats.size / 1024).toFixed(1)} KB`);
}

buildIcon().catch(err => {
  console.error('❌ 图标生成失败:', err);
  process.exit(1);
});

# 把选好的图片压缩成网页用尺寸，输出到 static/img/life/
# 用法：在项目根目录运行  powershell -ExecutionPolicy Bypass -File .\scripts\optimize-life.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$dst = Join-Path $root 'static\img\life'
New-Item -ItemType Directory -Force -Path $dst | Out-Null

$source = @(
  'D:\个人资料\图片\nigel-hoare-no6OZbsafBI-unsplash.jpg',
  'D:\个人资料\图片\mike-dorner-sf_1ZDA1YFw-unsplash.jpg',
  'D:\个人资料\图片\viktor-forgacs-QDMEADvb4PE-unsplash.jpg',
  'D:\个人资料\图片\a-rahmat-mn-RosMe9KSgwM-unsplash.jpg',
  'D:\个人资料\图片\birmingham-museums-trust-_fXZDGdrYZk-unsplash.jpg',
  'D:\个人资料\图片\diana-parkhouse-BIEAbVJ6AZk-unsplash.jpg'
)
$names = @('p1.jpg', 'p2.jpg', 'p3.jpg', 'p4.jpg', 'p5.jpg', 'p6.jpg')

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$quality = New-Object System.Drawing.Imaging.EncoderParameters(1)
$quality.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)

for ($i = 0; $i -lt $source.Count; $i++) {
  $src = $source[$i]
  if (-not (Test-Path -LiteralPath $src)) { continue }
  $img = [System.Drawing.Image]::FromFile($src)
  try {
    $maxW = 1400
    $scale = [Math]::Min(1.0, $maxW / $img.Width)
    $w = [int]($img.Width * $scale)
    $h = [int]($img.Height * $scale)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    try {
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.DrawImage($img, 0, 0, $w, $h)
      $g.Dispose()
      $out = Join-Path $dst $names[$i]
      $bmp.Save($out, $encoder, $quality)
      Write-Output ('已生成: ' + $out)
    } finally {
      $bmp.Dispose()
    }
  } finally {
    $img.Dispose()
  }
}

# 准备首页素材：头像 + 晾晒小相框照片（原图不动，只生成压缩副本）
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$static = Join-Path $root 'static\img'

function Save-Jpeg([System.Drawing.Image]$img, [string]$out, [int]$maxW, [int]$quality) {
  $scale = [Math]::Min(1.0, $maxW / $img.Width)
  $w = [int]($img.Width * $scale)
  $h = [int]($img.Height * $scale)
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $w, $h)
  $g.Dispose()
  $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $p = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
  $bmp.Save($out, $enc, $p)
  $bmp.Dispose()
}

# 头像
$avatarSrc = 'C:\Users\73771\Desktop\张中伟 (10).jpg'
if (Test-Path -LiteralPath $avatarSrc) {
  $img = [System.Drawing.Image]::FromFile($avatarSrc)
  Save-Jpeg $img (Join-Path $static 'avatar.jpg') 320 88
  $img.Dispose()
  Write-Output '头像已更新'
}

# 首页小相框照片
$homeDir = Join-Path $static 'home'
New-Item -ItemType Directory -Force -Path $homeDir | Out-Null
$srcDir = 'C:\Users\73771\Desktop\新建文件夹'
$i = 1
Get-ChildItem -LiteralPath $srcDir -File | Sort-Object Name | ForEach-Object {
  if ($i -le 20) {
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    $out = Join-Path $homeDir ('{0:D2}.jpg' -f $i)
    Save-Jpeg $img $out 360 82
    $img.Dispose()
    Write-Output ("生成 " + $out)
    $i++
  }
}

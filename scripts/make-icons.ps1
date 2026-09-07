# 从头像生成苹果主屏幕图标与网站 favicon（居中裁成正方形）
param([string]$Source = '')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

function New-SquareIcon([string]$src, [string]$out, [int]$size) {
  $img = [System.Drawing.Image]::FromFile($src)
  try {
    $side = [Math]::Min($img.Width, $img.Height)
    $x = [int](($img.Width - $side) / 2)
    $y = [int](($img.Height - $side) / 2)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $size, $size)),
      (New-Object System.Drawing.Rectangle($x, $y, $side, $side)),
      [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/png' }
    $p = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Compression, [long]0)
    $bmp.Save($out, $enc, $p)
    $bmp.Dispose()
  } finally { $img.Dispose() }
}

$root = Split-Path -Parent $PSScriptRoot
$src = if ($Source) { $Source } else { Join-Path $root 'static\img\avatar.jpg' }
New-SquareIcon $src (Join-Path $root 'static\img\apple-touch-icon.png') 180
New-SquareIcon $src (Join-Path $root 'static\img\icon-32.png') 32
New-SquareIcon $src (Join-Path $root 'static\img\icon-192.png') 192
New-SquareIcon $src (Join-Path $root 'static\img\icon-512.png') 512
Write-Output '图标已生成'

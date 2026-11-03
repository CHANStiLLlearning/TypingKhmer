Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::FromFile((Join-Path $PSScriptRoot 'public/hands-only.png'))

# Left Hand Bounding Box:
# Find exact min/max for left hand (x < 450)
$minX_L = 1000; $maxX_L = 0; $minY_L = 1000; $maxY_L = 0
for ($y = 0; $y -lt $b.Height; $y++) {
    for ($x = 0; $x -lt 450; $x++) {
        if ($b.GetPixel($x, $y).A -gt 0) {
            if ($x -lt $minX_L) { $minX_L = $x }
            if ($x -gt $maxX_L) { $maxX_L = $x }
            if ($y -lt $minY_L) { $minY_L = $y }
            if ($y -gt $maxY_L) { $maxY_L = $y }
        }
    }
}

# Right Hand Bounding Box:
# Find exact min/max for right hand (x >= 450)
$minX_R = 1000; $maxX_R = 0; $minY_R = 1000; $maxY_R = 0
for ($y = 0; $y -lt $b.Height; $y++) {
    for ($x = 450; $x -lt $b.Width; $x++) {
        if ($b.GetPixel($x, $y).A -gt 0) {
            if ($x -lt $minX_R) { $minX_R = $x }
            if ($x -gt $maxX_R) { $maxX_R = $x }
            if ($y -lt $minY_R) { $minY_R = $y }
            if ($y -gt $maxY_R) { $maxY_R = $y }
        }
    }
}

Write-Host "Left Hand:  X: $minX_L..$maxX_L (w=$($maxX_L - $minX_L + 1)), Y: $minY_L..$maxY_L (h=$($maxY_L - $minY_L + 1))"
Write-Host "Right Hand: X: $minX_R..$maxX_R (w=$($maxX_R - $minX_R + 1)), Y: $minY_R..$maxY_R (h=$($maxY_R - $minY_R + 1))"

# Crop Left Hand
$rectL = [System.Drawing.Rectangle]::new($minX_L, $minY_L, ($maxX_L - $minX_L + 1), ($maxY_L - $minY_L + 1))
$bmpL = $b.Clone($rectL, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpL.Save((Join-Path $PSScriptRoot 'public/left-hand.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$bmpL.Save((Join-Path $PSScriptRoot 'src/assets/left-hand.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$bmpL.Dispose()

# Crop Right Hand
$rectR = [System.Drawing.Rectangle]::new($minX_R, $minY_R, ($maxX_R - $minX_R + 1), ($maxY_R - $minY_R + 1))
$bmpR = $b.Clone($rectR, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpR.Save((Join-Path $PSScriptRoot 'public/right-hand.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$bmpR.Save((Join-Path $PSScriptRoot 'src/assets/right-hand.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$bmpR.Dispose()

$b.Dispose()
Write-Host "Left and Right hands cropped successfully!"

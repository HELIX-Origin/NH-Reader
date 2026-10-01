Add-Type -AssemblyName System.Drawing

$iconPath = Join-Path $PSScriptRoot "..\src-tauri\icons\icon.png"
$windowsDir = Join-Path $PSScriptRoot "..\src-tauri\windows"

if (-not (Test-Path $iconPath)) {
    Write-Error "Icon not found at $iconPath"
    exit 1
}

$icon = [System.Drawing.Image]::FromFile($iconPath)
$iconBmp = New-Object System.Drawing.Bitmap($icon)
$bg = $iconBmp.GetPixel(0, 0)
Write-Host "Sampled icon background color: R=$($bg.R) G=$($bg.G) B=$($bg.B)"

$headerWidth = 150
$headerHeight = 57
$headerBmp = New-Object System.Drawing.Bitmap($headerWidth, $headerHeight, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$gHeader = [System.Drawing.Graphics]::FromImage($headerBmp)
$gHeader.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gHeader.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gHeader.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gHeader.Clear($bg)

$iconSizeH = 48
$iconXH = $headerWidth - $iconSizeH - 8
$iconYH = [int](($headerHeight - $iconSizeH) / 2)
$gHeader.DrawImage($icon, $iconXH, $iconYH, $iconSizeH, $iconSizeH)
$gHeader.Dispose()

$headerPath = Join-Path $windowsDir "header.bmp"
$headerBmp.Save($headerPath, [System.Drawing.Imaging.ImageFormat]::Bmp)
$headerBmp.Dispose()
Write-Host "Generated $headerPath ($($headerWidth)x$($headerHeight))"

$sidebarWidth = 164
$sidebarHeight = 314
$sidebarBmp = New-Object System.Drawing.Bitmap($sidebarWidth, $sidebarHeight, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$gSidebar = [System.Drawing.Graphics]::FromImage($sidebarBmp)
$gSidebar.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gSidebar.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gSidebar.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gSidebar.Clear($bg)

$iconSizeS = 112
$iconXS = [int](($sidebarWidth - $iconSizeS) / 2)
$iconYS = 50
$gSidebar.DrawImage($icon, $iconXS, $iconYS, $iconSizeS, $iconSizeS)
$gSidebar.Dispose()

$sidebarPath = Join-Path $windowsDir "sidebar.bmp"
$sidebarBmp.Save($sidebarPath, [System.Drawing.Imaging.ImageFormat]::Bmp)
$sidebarBmp.Dispose()
Write-Host "Generated $sidebarPath ($($sidebarWidth)x$($sidebarHeight))"

$iconBmp.Dispose()
$icon.Dispose()

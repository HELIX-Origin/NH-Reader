param(
  [string]$BundleDir = "src-tauri/target/debug/bundle"
)

$certPath = "certificates/nh-desktop-codesign.pfx"
if (-not (Test-Path $certPath)) {
  Write-Error "Certificate not found at $certPath"
  exit 1
}

$signtool = Get-ChildItem "C:\Program Files (x86)\Windows Kits\10\bin\*\x64\signtool.exe" -ErrorAction SilentlyContinue | Select-Object -Last 1 -ExpandProperty FullName
if (-not $signtool) {
  $signtool = "signtool.exe"
}

$files = Get-ChildItem -Path $BundleDir -Include "*.exe", "*.msi" -Recurse -File -ErrorAction SilentlyContinue
foreach ($file in $files) {
  & $signtool sign /f $certPath /p "nh-desktop" /fd sha256 /tr "http://timestamp.digicert.com" /td sha256 $file.FullName
}

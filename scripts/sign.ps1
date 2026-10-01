param(
  [string]$BundleDir = "src-tauri/target/release/bundle"
)

$certPath = "certificates/nh-desktop-codesign.pfx"
if (-not (Test-Path $certPath)) {
  Write-Host "Certificate not found at $certPath. Generating self-signed code-signing certificate..."
  New-Item -ItemType Directory -Force -Path "certificates" | Out-Null
  $cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=HELIX Origin, O=HELIX Origin" -CertStoreLocation "Cert:\CurrentUser\My"
  $pwd = ConvertTo-SecureString -String "nh-desktop" -Force -AsPlainText
  Export-PfxCertificate -Cert $cert -FilePath $certPath -Password $pwd | Out-Null
}

$signtool = Get-ChildItem "C:\Program Files (x86)\Windows Kits\10\bin\*\x64\signtool.exe" -ErrorAction SilentlyContinue | Select-Object -Last 1 -ExpandProperty FullName
if (-not $signtool) {
  $signtool = "signtool.exe"
}

$files = Get-ChildItem -Path $BundleDir -Include "*.exe", "*.msi" -Recurse -File -ErrorAction SilentlyContinue
foreach ($file in $files) {
  Write-Host "Signing $($file.FullName)..."
  & $signtool sign /f $certPath /p "nh-desktop" /fd sha256 /tr "http://timestamp.digicert.com" /td sha256 $file.FullName
}

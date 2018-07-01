# INFO
 # https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-run-desktop-app-converter
 # https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-manual-conversion

Param(
  [string]$version
)

Write-Host "Ensure a Converter base iamge is setup found at https://aka.ms/converterimages"
Write-Host "Setup the image using: 'DesktopAppConverter.exe -Setup -BaseImage .\BaseImage-1XXXX.wim -Verbose'"

Write-Host ""
Write-Host " = Creating appx for version:" $version

Remove-Item "./appx" -Force -Recurse
Write-Host " = Cleared existing folder"

New-Item -ItemType Directory -Force -Path "./appx" | Out-Null
Write-Host " = Created an ./appx input folder"

New-Item -ItemType Directory -Force -Path "./dist/appx" | Out-Null
Write-Host " = Created an ./dist/appx folder"

Copy-Item "./dist/bunqDesktop Setup *.exe" "./appx/bunqDesktopSetup.exe"
Write-Host " = Copy latest installer to new folder"

Set-ExecutionPolicy Bypass
Write-Host " = Ensured execution policy"

Write-Host " = Starting converter"
DesktopAppConverter.exe `
 -Installer "./appx/bunqDesktopSetup.exe" `
 -InstallerArguments "/S" `
 -Destination "./dist/appx" `
 -PackageName "bunqDesktop" `
 -Publisher "CN=bunqCommunity" `
 -Version "$version" `
 -MakeAppx -Sign -Verbose -Verify

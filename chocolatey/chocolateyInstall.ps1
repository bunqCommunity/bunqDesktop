$name = 'BunqDesktop'
$installerType = 'exe'
$url  = 'https://github.com/BunqCommunity/BunqDesktop/releases/download/0.8.3/BunqDesktop.Setup.0.8.3.exe'
$silentArgs = '/silent'

Install-ChocolateyPackage $name $installerType $silentArgs $url

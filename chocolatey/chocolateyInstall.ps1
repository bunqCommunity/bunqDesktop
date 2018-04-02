$name = 'BunqDesktop'
$installerType = 'exe'
$url  = 'https://github.com/BunqCommunity/BunqDesktop/releases/download/0.8.1/BunqDesktop.Setup.${VERSION}.exe'
$silentArgs = '/silent'

Install-ChocolateyPackage $name $installerType $silentArgs $url

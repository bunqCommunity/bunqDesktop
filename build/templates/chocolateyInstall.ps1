$name = 'BunqDesktop'
$installerType = 'exe'
$url  = 'https://github.com/BunqCommunity/BunqDesktop/releases/download/${VERSION}/BunqDesktop.Setup.${VERSION}.exe'
$silentArgs = '/silent'

Install-ChocolateyPackage $name $installerType $silentArgs $url

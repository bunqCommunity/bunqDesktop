$name = 'bunqDesktop'
$installerType = 'exe'
$url  = 'https://github.com/BunqCommunity/bunqDesktop/releases/download/0.8.9/bunqDesktop.Setup.0.8.9.exe'
$silentArgs = '/silent'

Install-ChocolateyPackage $name $installerType $silentArgs $url

$name = 'bunqDesktop'
$installerType = 'exe'
$url  = 'https://github.com/bunqCommunity/bunqDesktop/releases/download/0.9.0/bunqDesktop.Setup.0.9.0.exe'
$silentArgs = '/silent'

Install-ChocolateyPackage $name $installerType $silentArgs $url

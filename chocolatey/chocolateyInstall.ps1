$name = 'bunqDesktop'
$installerType = 'exe'
$url  = 'https://github.com/bunqCommunity/bunqDesktop/releases/download/0.9.10/bunqDesktop-0.9.10.exe'
$silentArgs = '/silent'

Install-ChocolateyPackage $name $installerType $silentArgs $url

#/bin/bash
echo " This script assumens you have your chocolatey API key available in environment variable 'CHOCOLATEY_API_KEY'"

if [ -z ${1} ]; then
  echo "Version not set!"
  exit
else
  echo
fi

echo " - Creating choco package"
choco pack

echo " - Setup api key"
choco apikey -k $CHOCOLATEY_API_KEY -source https://push.chocolatey.org/

echo " - Publishing new package"
choco push bunqdesktop.$1.nupkg -s https://push.chocolatey.org/
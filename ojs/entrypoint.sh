#!/bin/sh

# If config.inc.php does not exist or is marked as installed = Off, configure it
if [ ! -f /var/www/html/config.inc.php ] || grep -q "installed = Off" /var/www/html/config.inc.php; then
  echo "Generating config.inc.php with persistent credentials..."
  cp /var/www/html/config.TEMPLATE.inc.php /var/www/html/config.inc.php
  
  # Enable installation status
  sed -i 's/installed = Off/installed = On/g' /var/www/html/config.inc.php
  
  # Configure base URL
  sed -i 's|base_url = "https://pkp.sfu.ca/ojs"|base_url = "https://earnest-hope-production.up.railway.app"|g' /var/www/html/config.inc.php
  
  # Configure database (using internal network credentials)
  sed -i 's/host = localhost/host = mysql.railway.internal:3306/g' /var/www/html/config.inc.php
  sed -i 's/username = ojs/username = root/g' /var/www/html/config.inc.php
  sed -i 's/password = ojs/password = ekqJIcTAbYgtdpuioDoWhRMYJLRoNjli/g' /var/www/html/config.inc.php
  sed -i 's/name = ojs/name = railway/g' /var/www/html/config.inc.php
  
  # Configure files dir
  sed -i 's|files_dir = files|files_dir = /var/www/html/files|g' /var/www/html/config.inc.php
fi

# Ensure correct permissions on persistent directories
chown -R apache:apache /var/www/html/files
chown -R apache:apache /var/www/html/public

# Run the default OJS command passed to the container
exec "$@"

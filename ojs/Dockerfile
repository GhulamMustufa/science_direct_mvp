FROM pkpofficial/ojs:stable-3_4_0

# Tell Apache that the request is HTTPS when forwarded by Railway proxy
RUN echo 'SetEnvIf X-Forwarded-Proto "https" HTTPS=on' >> /var/www/html/.htaccess

# Disable IP validation on sessions (prevents instant logout behind Railway reverse proxy)
RUN sed -i 's/session_check_ip = On/session_check_ip = Off/g' /var/www/html/config.TEMPLATE.inc.php
RUN sed -i 's/session_check_ip = On/session_check_ip = Off/g' /var/www/html/config.inc.php

# Trust proxy headers so OJS gets correct client IPs
RUN sed -i 's/trust_x_forwarded_for = Off/trust_x_forwarded_for = On/g' /var/www/html/config.TEMPLATE.inc.php
RUN sed -i 's/trust_x_forwarded_for = Off/trust_x_forwarded_for = On/g' /var/www/html/config.inc.php

# Create a runtime entrypoint script to fix volume permissions on startup
RUN printf '#!/bin/sh\n\
chown -R apache:apache /var/www/html/files\n\
chown -R apache:apache /var/www/html/public\n\
exec "$@"\n' > /entrypoint.sh && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["ojs-start"]


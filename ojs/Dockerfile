FROM pkpofficial/ojs:stable-3_4_0

# Tell Apache that the request is HTTPS when forwarded by Railway proxy
RUN echo 'SetEnvIf X-Forwarded-Proto "https" HTTPS=on' >> /var/www/html/.htaccess

EXPOSE 80


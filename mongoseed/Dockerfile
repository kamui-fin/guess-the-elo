FROM mongo
COPY init.json /init.json
CMD mongoimport --host db --db eloguess --collection games --type json --file /init.json --jsonArray

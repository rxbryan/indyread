## Setup a local indy network

To set up an indy network locally for testing indyread. You can use
```
./scripts/setup_testnetwork.sh
```

This will start up
- von network node
- populate the nodes with a few transactions, enough for testing

Next startup an elasticsearch image by running: 
```
make es-up
```

*daemon*

```
cd daemon &&  npm run start
```

*api*
```
cd api && npm run dev
```

This will start up
- indyread services (scanner, api, elasticsearch)
- by default also kibana, you can opt-out by commenting it out in the `docker-compose.es` file
-  Starts up the api and scanner and connect to the test network by default

# Stop the network.
```
./scripts/stop_testnetwork.sh
```
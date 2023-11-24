# Planner

Environments variables

```
TASKS=20
```

### Install dependencies

```
yarn
```

or

```
npm install
```

### Start worker

```bash
node main
```

Add new worker

```sh
curl -X POST localhost:3000/register  -H "Content-Type: application/json"  -d '{"url": "http://localhost:8080"}'
```

Add new workers

```sh
./connect.sh http://localhost:8080 http://localhost:8081 http://localhost:8083 http://unsuperworjker:8080
```

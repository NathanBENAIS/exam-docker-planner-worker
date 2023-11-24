docker network create mynetwork
docker run --network=mynetwork --name worker -p 8080:8080 -d worker
docker run --network=mynetwork --name planner -p 3000:3000 -d planner
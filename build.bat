docker build -t worker . -f worker/Dockerfile.worker
docker build -t planner . -f planner/Dockerfile.planner
require('dotenv').config()
const fetch = require('node-fetch')
const express = require('express')

const port = process.env.PORT || 3000
const nbTasks = parseInt(process.env.TASKS) || 4

const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min
const taskType = () => (randInt(0, 2) ? 'mult' : 'add')
const args = () => ({ a: randInt(0, 40), b: randInt(0, 40) })

const generateTasks = (i) =>
  new Array(i).fill(1).map((_) => ({ type: taskType(), args: args() }))

  let workers = [];
  let generalCount = 0;
  let multiplicationCount = 0;
  let additionCount = 0;
  
  for (let i = 1; i <= 30; i++) {
    let workerType;
    
    if (generalCount < 10) {
      workerType = 'general';
      generalCount++;
    } else if (multiplicationCount < 10) {
      workerType = 'mult';
      multiplicationCount++;
    } else {
      workerType = 'add';
      additionCount++;
    }
  
    const worker = {
      url: "http://exam-docker-planner-worker-worker-"+ i + ":8080",
      id: i.toString(),
      type: workerType,
    };
    workers.push(worker);
  }
  let genWorkers = [];
let multWorkers = [];
let addWorkers = [];
   genWorkers = workers.filter((worker) => worker.type === 'general');
   multWorkers = workers.filter((worker) => worker.type === 'mult');
   addWorkers = workers.filter((worker) => worker.type === 'add');

const app = express()
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => {
  res.send(JSON.stringify(workers))
})

app.post('/register', (req, res) => {
  const { url, id, type } = req.body
  console.log(`Register: adding ${url} worker: ${id} with type: ${type}`)
  if(type === 'general') {
    genWorkers.push({ url, id })
  }
  if(type === 'mult') {
    multWorkers.push({ url, id, type })
  }
  if(type === 'add') {
    addWorkers.push({ url, id, type })
  }
  res.send('ok')
})

let tasks = generateTasks(nbTasks)
let taskToDo = nbTasks

const wait = (mili) =>
  new Promise((resolve, reject) => setTimeout(resolve, mili))

const sendTask = async (worker, task) => {
  console.log(`=> ${worker.url}/${task.type}`, task)
  if (worker.type == 'mult'){
    multWorkers = multWorkers.filter((w) => w.id !== worker.id)
  }
  if (worker.type == 'add'){
    addWorkers = addWorkers.filter((w) => w.id !== worker.id)
  }
  if (worker.type === 'general'){
    genWorkers = genWorkers.filter((w) => w.id !== worker.id)
  }

  tasks = tasks.filter((t) => t !== task)
  const request = fetch(`${worker.url}/${task.type}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task.args),
  })
    .then((res) => {
      if (worker.type === 'mult'){
        multWorkers = [...multWorkers, worker]
      }
      if (worker.type === 'add'){
        addWorkers = [...addWorkers, worker]
      }
      if (worker.type === 'general'){
        genWorkers = [...genWorkers, worker]
      }
      return res.json()
    })
    .then((res) => {
      taskToDo -= 1
      console.log('---')
      console.log(nbTasks - taskToDo, '/', nbTasks, ':')
      console.log(task, 'has res', res)
      console.log('---')
      return res
    })
    .catch((err) => {
      console.error(task, ' failed', err.message)
      tasks = [...tasks, task]
    })
}

const main = async () => {
  console.log(tasks)
  console.log("workers : ",workers)
  console.log("multworkers : ",multWorkers)
  console.log("addworkers : ",addWorkers)

  while (taskToDo > 0) {
    await wait(100)
    if (genWorkers.length === 0 || multWorkers.length === 0 || addWorkers.length === 0 || tasks.length === 0) continue
    if(genWorkers.length > addWorkers.length && genWorkers.length > multWorkers.length) {
      genWorkers.length === 0 ? console.log("No gen worker available") : sendTask(genWorkers[0], tasks[0])
      continue
    }
    if(tasks[0].type === 'mult')
    {
      multWorkers.length === 0 ? console.log("No mult worker available") : sendTask(multWorkers[0], tasks[0])
      continue
    }
    if(tasks[0].type === 'add')
    {
      addWorkers.length === 0 ? console.log("No add worker available") : sendTask(addWorkers[0], tasks[0])
    }
  }
  console.log('end of tasks')
  server.close()
}

const server = app.listen(port, () => {
  console.log(`Register listening at http://localhost:${port}`)
  console.log('starting tasks...')
  main()
})
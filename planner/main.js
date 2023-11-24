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
  
  for (let i = 1; i <= 10; i++) {
    const workerType = Math.random() < 0.5 ? 'mult' : 'add';
        
    const worker = {
      url: "http://exam-docker-planner-worker-worker-"+ i + ":8080",
      id: i.toString(),
      type: workerType,
    };
    workers.push(worker); 
  }
  
  let multWorkers = workers.filter((w) => w.type === 'mult');
  let addWorkers = workers.filter((w) => w.type === 'add');

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
  const { url, id } = req.body
  console.log(`Register: adding ${url} worker: ${id}`)
  workers.push({ url, id })
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
      if (worker.type == 'mult'){
        multWorkers = [...multWorkers, worker]
      }

      if (worker.type == 'add'){
        addWorkers = [...addWorkers, worker]
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
    if (multWorkers.length === 0 || addWorkers.length === 0 || tasks.length === 0) continue

   if(tasks[0].type == 'mult')
   {
   multWorkers.length == 0 ? console.log("No worker available") : sendTask(multWorkers[0], tasks[0]) 
   continue
  }
  if(tasks[0].type == 'add' )
  {
    multWorkers.length == 0 ? tconsole.log("No worker available") : sendTask(addWorkers[0], tasks[0])
    continue
  }
 continue
  }
  console.log('end of tasks')
  server.close()
}

const server = app.listen(port, () => {
  console.log(`Register listening at http://localhost:${port}`)
  console.log('starting tasks...')
  main()
})
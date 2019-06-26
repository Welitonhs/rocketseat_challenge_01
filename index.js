const express = require("express");

const app = express();

app.use(express.json());

const projects = [];
let countCallsHttp = 0;

function checkProjectExist(req, res, next) {
  const { id } = req.params;
  const existProject = projects.findIndex(project => project.id === id);

  if (existProject < 0)
    return res.status(400).json({ Error: `Project id: ${id} does not exist.` });

  next();
}

function sumCallHttp(req, res, next) {
  countCallsHttp++;
  console.log(`Número de requisições: ${countCallsHttp}`);
  next();
}

app.use(sumCallHttp);

app.get("/projects", (req, res) => {
  res.json(projects);
});

app.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);

  res.json(projects);
});

app.put("/projects/:id", checkProjectExist, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(project => project.id === id);

  project.title = title;

  res.json(project);
});

app.delete("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  projects.splice(projectIndex, 1);

  res.json(projects);
});

app.post("/projects/:id/tasks", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  const task = [title];

  project.tasks.push(task);

  res.json(projects);
});

app.listen(3000);

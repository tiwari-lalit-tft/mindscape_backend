const Project = require("../../models/project");

// Create a new project
const createProject = async (req, res) => {
  try {
    const { project_name, project_members, userId } = req.body;
    const newProject = await Project.create({ project_name, project_members, userId });
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

// List all projects
const getAllProjects = async (req, res) => {
  try {
    const { userId } = req.body;
    const projects = await Project.find({ userId });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error listing projects:", error);
    res.status(500).json({ error: "Failed to list projects" });
  }
};

// Update a project by ID
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { project_name, project_members } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { project_name, project_members },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
};

// Delete a project by ID
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    await Project.findByIdAndDelete(projectId);
    res.status(204).send("project deleted");
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject
};

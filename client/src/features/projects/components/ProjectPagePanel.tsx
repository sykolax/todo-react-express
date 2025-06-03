import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from '@/lib/axios';
import Panel from "./Panel";
import type { ProjectRowProps, TaskRowProps } from "./Panel";
import { useNavigate } from "react-router";

type ProjectResponse = {
    id: number;
    title: string;
    userId: number;
}

export type TaskResponse = {
    id: number;
    description: string;
    completed: boolean;
    projectId: number;
}

export default function ProjectPagePanel(){

    const [projects, setProjects] = useState<ProjectRowProps[]>([]);
    const [currentProjectId, setCurrentProjectId] = useState<number>();
    const [tasks, setTasks] = useState<TaskRowProps[]>([]);
    const authContext = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authContext.isLoggedIn && !authContext.isLoading) {
            navigate('/login');
        }
    })

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects');
                const data = response.data;
                if (data.projects.length > 0) {
                    setProjects(data.projects.map((project: ProjectResponse) => { return {
                    id: project.id, title: project.title, setCurrentProjectId: setCurrentProjectId, 
                    editHandler: updateProject, deleteHandler: deleteProject };}
                    ));
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchProjects();
    }, [authContext.isLoggedIn && !authContext.isLoading]);

    useEffect(() => {
        if (currentProjectId !== undefined) {
            fetchTasks(currentProjectId);
        }
    }, [currentProjectId]);

    async function fetchTasks(pid: number) {
        try {
            const response = await api.get(`projects/${pid}/tasks`);
            const data = response.data;
            setTasks(data.tasks.map((task: TaskResponse) => {
                return {id: task.id, description: task.description, 
                completed: task.completed, editHandler: updateTask, deleteHandler: deleteTask}
            }));
        } catch (error) {
            console.error(error);
        }
    }

    async function createProject(title: string) {
        try {
            const response = await api.post('projects/', {
                title: title,
            });
            const data = response.data;
            setProjects([
                ...projects, 
                {id: data.project.id, title: data.project.title, setCurrentProjectId: setCurrentProjectId,
                 editHandler: updateProject, deleteHandler: deleteProject},
            ]);
        } catch (error) {
            console.error(error);
        }
    }

    async function createTask(description: string) {
        try {
            const response = await api.post(`projects/${currentProjectId}/tasks`, {
                description: description,
            });
            const data = response.data;
            setTasks([
                ...tasks, 
                { id: data.task.id, description: data.task.description, completed: data.task.completed, 
                editHandler: updateTask, deleteHandler: deleteTask },
            ]);
        } catch (error) {
            console.error(error);
        }
    }

    async function updateProject(pid: number, newTitle: string) {
        try {
            const response = await api.patch(`projects/${pid}`, {
                title: newTitle,
            });
            const data = response.data;

            // Don't mutate state!
            setProjects(prev =>
            prev.map(project =>
                project.id === data.project.id
                ? { ...project, title: newTitle }
                : project
            ));

        } catch(error) {
            console.error(error);
        }
    }

    async function updateTask(tid: number, updatedFields: Partial<TaskResponse>) {
        try {
            const response = await api.patch(`tasks/${tid}`, updatedFields);
            const data = response.data;
            setTasks(tasks => 
                tasks.map(task => 
                    task.id === data.task.id ? { ...task, ...updatedFields } : task
                )
            );
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteProject(pid: number) {
        try {
            const response = await api.delete(`projects/${pid}`);
            const data = response.data;
            setProjects(projects => projects.filter(project => project.id !== data.project.id));            
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteTask(tid: number) {
        try {
            const response = await api.delete(`tasks/${tid}`);
            const data = response.data;
            setTasks(tasks => tasks.filter(task => task.id !== data.task.id));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex px-10 gap-10 mt-20">
            <Panel className="grow-1" type="project" items={projects} title="PROJECTS" inputPlaceholder="Enter your project name" submitHandler={createProject} />
            <Panel className="grow-2" type="task" items={tasks} title="TASKS" inputPlaceholder="Enter your task name" submitHandler={createTask}/>
        </div>
    );
}
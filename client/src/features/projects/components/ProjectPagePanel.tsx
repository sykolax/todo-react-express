import Panel from "./Panel";

export default function ProjectPagePanel(){
    return (
        <div className="flex px-10 gap-10 mt-20">
            <Panel className="grow-1" type="project" items={[{id: 1, label: "Project one"}, {id: 2, label: "Project TWO"}]} title="PROJECTS" inputPlaceholder="Enter your project name" />
            <Panel className="grow-2" type="task" items={[{id: 1, label: "Task one", checked: true}, {id: 2, label: "Task TWO", checked:false}, {id: 3, label: "Task threee", checked:false}, {id: 4, label: "Task four", checked:false},]} title="TASKS" inputPlaceholder="Enter your task name" />
        </div>
    );
}
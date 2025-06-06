import editIcon from '@assets/edit_icon.svg';
import trashIcon from '@assets/trash_icon.svg';
import checkIcon from '@assets/check_icon.svg';
import addIcon from '@assets/add_icon.svg';
import uncheckedIcon from '@assets/checkbox_unchecked.svg';
import checkedIcon from '@assets/checkbox_checked.svg';
import { useRef, useState } from 'react';
import type { TaskResponse } from './ProjectPagePanel';

export type ItemProps = {
    id: number;
    label: string;
    checked?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export type ProjectRowProps = {
    id: number;
    title: string;
    setCurrentProjectId: (pid: number) => void;
    editHandler: (pid: number, newTitle: string) => void;
    deleteHandler: (pid: number) => void;
}

export type TaskRowProps = {
    id: number;
    description: string;
    completed: boolean;
    editHandler: (tid: number, newFields: Partial<TaskResponse>) => void;
    deleteHandler: (tid: number) => void;
}

type EditableRecordProps = {
    value: string;
    name: string;
    submitHandler: (val: string) => void;
    formRef: React.Ref<HTMLFormElement>;
}

type ItemListProps = {
    items: ProjectRowProps[] | TaskRowProps[];
    type: PanelType;
    currentProjectId?: number;
}

type ItemInputProps = {
    placeholder: string;
    onSubmit: (val: string) => void; 
}

type IconButtonProps = {
    icon: string;
    onClick?: () => void;
    type?: "submit" | "reset" | "button" | undefined;
}

type RowButtonSetProps = {
    checkOnClick: () => void;
    deleteOnClick: () => void; 
    isEditMode: boolean;   
    setEditMode: (val: boolean) => void;
}

type PanelType = "project" | "task";

export type PanelProps = {
    type: PanelType;
    items: ProjectRowProps[] | TaskRowProps[];
    title: string; 
    inputPlaceholder: string;
    submitHandler: (val:string) => void;
    projectClickHandler?: (pid: number) => void;
    className?: string;
    currentProjectId?: number;
}

function IconButton({ icon, onClick, type}: IconButtonProps ) {

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        if (onClick) {
            onClick();
        }
    }

    return (
        <button onClick={handleClick} type={type}><img src={icon}/></button>
    );
}

function RowButtonSet({ checkOnClick, deleteOnClick, isEditMode, setEditMode }: RowButtonSetProps) {

    function handleCheckClick() {
        setEditMode(false);
        checkOnClick();
    }

    function handleEditClick() {
        setEditMode(true);
    }

    return (
            <div className="flex gap-3 shrink-0">
                { isEditMode && <IconButton icon={checkIcon} onClick={handleCheckClick} /> }
                { !isEditMode && <IconButton icon={editIcon} onClick={handleEditClick}/> }
                <IconButton icon={trashIcon} onClick={deleteOnClick}/> 
            </div>
    );
}

function EditableRecord({ value, name, submitHandler, formRef }: EditableRecordProps) {
    const [inputValue, setInputValue] = useState(value);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        submitHandler(inputValue);
    }

    return (
        <form className="w-full mr-3" onSubmit={handleSubmit} ref={formRef}>
            <input autoFocus className="w-full" type="text" value={inputValue} name={name} onChange={(e) => setInputValue(e.target.value)}/>
        </form>
    );
}

function ProjectRow ({ projectProps, currentProjectId }: { projectProps: ProjectRowProps; currentProjectId: number }) {
    const [isEditMode, setIsEditMode] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    function handleClick() {
        projectProps.setCurrentProjectId(projectProps.id);
        // console.log(projectProps.id, projectProps.currentProjectId);
    }

    function handleConfirmClick() {
        // triggers the editable record form submit -> handleRecordSubmit(edit the project)
        formRef.current?.requestSubmit();
    }

    function handleRecordSubmit(inputValue: string) {
        console.log(projectProps);
        projectProps.editHandler(projectProps.id, inputValue);
    }

    function handleDeleteClick() {
        projectProps.deleteHandler(projectProps.id);
    }

    return (
        <div className={`${projectProps.id === currentProjectId ? 'bg-lime-100':'bg-stone-100'} px-5 py-3 w-full text-black flex justify-between cursor-pointer mb-3`} onClick={handleClick}>
            { isEditMode ? 
            <EditableRecord value={projectProps.title} name={`project-${projectProps.id}`} submitHandler={handleRecordSubmit} formRef={formRef} /> : 
            projectProps.title }
            <RowButtonSet checkOnClick={handleConfirmClick} deleteOnClick={handleDeleteClick} isEditMode={isEditMode} setEditMode={setIsEditMode}/>
        </div>
    );
}

function TaskRow ({ taskProps }: { taskProps: TaskRowProps }) {
    const [isEditMode, setIsEditMode] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    function handleCheck() {
        taskProps.editHandler(taskProps.id, {completed: true});
    }

    function handleUncheck() {
        taskProps.editHandler(taskProps.id, {completed: false});
    }

    function handleConfirmClick() {
        formRef.current?.requestSubmit();
    }

    function handleDeleteClick() {
        taskProps.deleteHandler(taskProps.id);
    }

    function handleRecordSubmit(inputValue: string) {
        taskProps.editHandler(taskProps.id, {description: inputValue});
    }

    return (
        <div className={`task px-5 py-3 w-full text-black flex justify-between mb-3 ${taskProps.completed ? 'task-completed': '' }`}>
            <div className="flex gap-3">
                { taskProps.completed ? <IconButton icon={checkedIcon} onClick={handleUncheck} /> : <IconButton icon={uncheckedIcon} onClick={handleCheck} /> }
                { isEditMode ? 
                <EditableRecord value={taskProps.description} name={`task-${taskProps.id}`} submitHandler={handleRecordSubmit} formRef={formRef} /> : 
                <p className={taskProps.completed ? 'line-through': ''}>{ taskProps.description }</p> }
            </div>
            <RowButtonSet checkOnClick={handleConfirmClick} deleteOnClick={handleDeleteClick} isEditMode={isEditMode} setEditMode={setIsEditMode}/>
        </div>
    );
}

function ItemList({ items, type, currentProjectId } : ItemListProps ) {
    return (
        <div className="flex flex-col">
            { type === "project" &&
            (items as ProjectRowProps[]).map(item => (
                <ProjectRow key={item.id} projectProps={item} currentProjectId={currentProjectId!}  />
            ))}
            { type === "task" &&
            (items as TaskRowProps[]).map(item => (
                <TaskRow key={item.id} taskProps={item} />
            ))}
        </div>
    );
}

function ItemInput({ placeholder, onSubmit }: ItemInputProps) {
    const [inputValue, setInputValue] = useState('');

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSubmit(inputValue);
        setInputValue('');
    }
    
    return (
        <form onSubmit={handleSubmit} className="flex justify-between gap-3">
            <input className="bg-stone-100 px-5 py-3 grow rounded-3xl" type="text" name="inputData" placeholder={placeholder} value={inputValue} onChange={(e)=> setInputValue(e.target.value)}/>
            <IconButton icon={addIcon} type="submit"/>
        </form>
    );
}

export default function Panel({ type, items, title, inputPlaceholder, submitHandler, className, currentProjectId }: PanelProps) {
    return (
        <>
            <div className={"text-left " + className}>
                <h2 className="text-xl mb-3">{title}</h2>
                <ItemList items={items} type={type} currentProjectId={currentProjectId}/>
                <ItemInput placeholder={inputPlaceholder} onSubmit={submitHandler}/>
            </div>
        </>
    );
}

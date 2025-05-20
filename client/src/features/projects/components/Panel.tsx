import editIcon from '@assets/edit_icon.svg';
import trashIcon from '@assets/trash_icon.svg';
import checkIcon from '@assets/check_icon.svg';
import addIcon from '@assets/add_icon.svg';
import uncheckedIcon from '@assets/checkbox_unchecked.svg';
import checkedIcon from '@assets/checkbox_checked.svg';

type ItemProps = {
    id: number;
    label: string;
    checked?: boolean;
}

type ItemListProps = {
    items: ItemProps[];
    Row: React.ComponentType<{ itemProps: ItemProps }>;
}

type PanelType = "project" | "task";

type PanelProps = {
    type: PanelType;
    items: ItemProps[];
    title: string; 
    inputPlaceholder: string;
    className?: string;
}

function IconButton({ icon }: { icon: string }) {
    return (
        <button><img src={icon}/></button>
    );
}

function RowButtonSet() {
    return (
            <div className="flex gap-3">
                <IconButton icon={checkIcon}/>
                <IconButton icon={editIcon}/>
                <IconButton icon={trashIcon}/>
            </div>
    );
}

function ProjectRow ({ itemProps }: { itemProps: ItemProps }) {
    return (
        <div className="bg-stone-100 px-5 py-3 w-full text-black flex justify-between">
            { itemProps.label }
            <RowButtonSet />
        </div>
    );
}

function TaskRow ({ itemProps }: { itemProps: ItemProps }) {
    return (
        <div className="bg-stone-100 px-5 py-3 w-full text-black flex justify-between">
            <div className="flex gap-3">
                <IconButton icon={uncheckedIcon} />
                { itemProps.label }
            </div>
            <RowButtonSet />
        </div>
    );
}

function ItemList({ items, Row }: ItemListProps ) {
    return (
        <div className="flex flex-col gap-3">
            {items.map(item => <Row key={item.id} itemProps={item} />)}
        </div>
    );
}

function ItemInput({ placeholder }: { placeholder: string }) {
    return (
        <div className="flex justify-between gap-3 mt-4">
            <input className="bg-stone-100 px-5 py-3 grow rounded-3xl" type="text" placeholder={placeholder}/>
            <IconButton icon={addIcon} />
        </div>
    );
}

export default function Panel({ type, items, title, inputPlaceholder, className }: PanelProps) {

    return (
        <>
            <div className={"text-left "+className}>
                <h2 className="text-xl mb-3">{title}</h2>
                <ItemList items={items} Row={ type === "project" ? ProjectRow : TaskRow }/>
                <ItemInput placeholder={inputPlaceholder}/>
            </div>
        </>
    );
}

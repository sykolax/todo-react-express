import { Link } from 'react-router-dom';

type NavLink = {
    id: number;
    label: string;
    path: string;
    classNames: string;
}

const buttonClassNames = {
    filled: 'text-white bg-black',
    empty: 'text-black bg-white',
} 

interface NavLinkProps {
    navLinks: NavLink[];
}

const loggedOutNavLinks: NavLink[] = [
    { id: 0, label: 'register', path: '/register', classNames: buttonClassNames.empty },
    { id: 1, label: 'log in', path: '/login' , classNames: buttonClassNames.filled }
];

const loggedInNavLinks: NavLink[] = [
    { id: 0, label: 'projects', path: '/projects', classNames: buttonClassNames.empty }, 
    { id: 1, label: 'log out', path: '/logout', classNames: buttonClassNames.filled }
];

export function NavItem({ navLink }: { navLink: NavLink }) {
    return (
        <Link className={"px-7 py-2 border-1 border-solid border-black rounded-4xl uppercase " + navLink.classNames} to={navLink.path}>{navLink.label}</Link>
    );
}

export function NavItems({ navLinks }: NavLinkProps) {
    return (
        navLinks.map(navLink => <NavItem key={navLink.id} navLink={navLink}></NavItem>)
    );
}

export default function NavHeader({ isLoggedIn }: {isLoggedIn: boolean}) {
    return (
        <nav className="sticky top-0 py-4 px-10 flex justify-between items-center w-full">
            <div className="logo-wrapper"> 
                <Link className="logo" to="/">TODOO</Link>
            </div>
            <div className="nav-item-wrapper flex flex-wrap items-center gap-7">
                <h2>{isLoggedIn && 'HELLO SYKO!'}</h2>
                <NavItems navLinks={isLoggedIn? loggedInNavLinks : loggedOutNavLinks} />
            </div>
        </nav>
    );
}
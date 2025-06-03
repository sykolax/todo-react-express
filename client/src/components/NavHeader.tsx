import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

type NavLink = {
    id: number;
    label: string;
    path?: string;
    classNames: string;
    onClick?: () => void;
};

const buttonClassNames = {
    filled: 'text-white bg-black',
    empty: 'text-black bg-white',
};

interface NavLinkProps {
    navLinks: NavLink[];
}

export function NavItem({ navLink }: { navLink: NavLink }) {
    const classes = "px-7 py-2 border-1 border-solid border-black rounded-4xl uppercase " + navLink.classNames

    if (navLink.path) {
        return (
        <Link className={classes} to={navLink.path}>{navLink.label}</Link>
    );
    }

    return (
        <button className={classes} onClick={navLink.onClick}>{navLink.label}</button>
    );

}

export function NavItems({ navLinks }: NavLinkProps) {
    return (
        navLinks.map(navLink => <NavItem key={navLink.id} navLink={navLink}></NavItem>)
    );
}

export default function NavHeader() {
    const authContext = useAuth();

    const loggedOutNavLinks: NavLink[] = [
    { id: 0, label: 'register', path: '/register', classNames: buttonClassNames.empty },
    { id: 1, label: 'log in', path: '/login' , classNames: buttonClassNames.filled }
    ];

    const loggedInNavLinks: NavLink[] = [
    { id: 0, label: 'projects', path: '/projects', classNames: buttonClassNames.empty }, 
    { id: 1, label: 'log out', classNames: buttonClassNames.filled, onClick: authContext.logout}
    ];

    return (
        <nav className="sticky top-0 py-4 px-10 flex justify-between items-center w-full">
            <div className="logo-wrapper"> 
                <Link className="logo" to="/">TODOO</Link>
            </div>
            <div className="nav-item-wrapper flex flex-wrap items-center gap-7">
                <h2>{authContext.isLoggedIn && `HELLO ${authContext.username.toUpperCase()}!`}</h2>
                <NavItems navLinks={authContext.isLoggedIn? loggedInNavLinks : loggedOutNavLinks} />
            </div>
        </nav>
    );
}
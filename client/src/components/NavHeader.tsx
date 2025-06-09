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
    filled: 'text-white bg-black hover:text-black',
    empty: 'text-black bg-white',
};

interface NavLinkProps {
    navLinks: NavLink[];
}

//md -> min-width
export function NavItem({ navLink }: { navLink: NavLink }) {
    const classes = "px-4 py-1 md:px-7 md:py-2 border-1 border-solid border-black rounded-4xl uppercase hover:bg-lime-200 " + navLink.classNames

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
        <nav className="sticky top-0 py-2 px-3 md:py-4 md:px-10 flex justify-between items-center w-full navbar">
            <div className="logo-wrapper"> 
                <Link className="logo" to="/projects">TODOO</Link>
            </div>
            <div className="nav-item-wrapper flex items-center gap-2 sm:gap-7">
                <h2>{authContext.isLoggedIn && `HELLO ${authContext.username.toUpperCase()}!`}</h2>
                <NavItems navLinks={authContext.isLoggedIn? loggedInNavLinks : loggedOutNavLinks} />
            </div>
        </nav>
    );
}
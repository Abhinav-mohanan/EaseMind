import { Link } from 'react-router-dom';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/articles', label: 'Articles' },
  { path: '/therapist', label: 'Therapist' },
  { path: '#', label: 'About' },
  { path: '#', label: 'Contact' },
];

const NavLinks = ({ linkClassName }) => {
  const defaultClassName = "text-gray-700 font-medium hover:text-customBlue";
  return (
    <>
      {navLinks.map(({ path, label }) => (
        <Link key={label} to={path} className={linkClassName || defaultClassName}>
          {label}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
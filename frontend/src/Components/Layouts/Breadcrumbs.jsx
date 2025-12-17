import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="text-sm text-slate-500 mb-2 flex items-center space-x-2">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.link ? (
            <Link
              to={item.link}
              className="hover:text-teal-600 hover:font-medium transition-all translate-300"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-teal-700 font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;

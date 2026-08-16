import React from 'react';

export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800 leading-tight">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}

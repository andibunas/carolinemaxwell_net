import ChildCard from '../ChildCard';

export default function GridLayout({ project, basePath }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 mt-12">
      {(project.children || []).map((child, index) => {
        // Divider only on items not in the first row, which depends on the column count.
        const divider = [
          index > 0 && 'pt-10 border-t border-ink/10',
          index < 2 && 'sm:pt-0 sm:border-t-0',
          index < 3 && 'lg:pt-0 lg:border-t-0',
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <ChildCard
            key={child.id}
            node={child}
            to={`${basePath}/${child.id}`}
            indexStyle
            className={divider}
          />
        );
      })}
    </div>
  );
}

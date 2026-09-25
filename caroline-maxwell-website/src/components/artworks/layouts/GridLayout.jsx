import ChildCard from '../ChildCard';

export default function GridLayout({ project, basePath }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 mt-12">
      {(project.children || []).map((child) => (
        <ChildCard key={child.id} node={child} to={`${basePath}/${child.id}`} />
      ))}
    </div>
  );
}

import ChildCard from '../ChildCard';

export default function GridLayout({ project, basePath }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 mt-12">
      {(project.children || []).map((child) => (
        <ChildCard key={child.id} node={child} to={`${basePath}/${child.id}`} />
      ))}
    </div>
  );
}

import ChildCard from '../ChildCard';

export default function GridLayout({ project, basePath }) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 mt-12">
      {(project.children || []).map((child) => (
        <ChildCard key={child.id} node={child} to={`${basePath}/${child.id}`} />
      ))}
    </div>
  );
}

import ChildCard from '../ChildCard';

export default function GridLayout({ category, basePath }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 mt-12">
      {(category.children || []).map((child) => (
        <ChildCard key={child.id} node={child} to={`${basePath}/${child.id}`} />
      ))}
    </div>
  );
}

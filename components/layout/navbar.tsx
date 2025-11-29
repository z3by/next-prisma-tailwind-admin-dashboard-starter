import LanguageSwitcher from '../language-switcher';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow">
      <div>{/* Breadcrumbs or Title could go here */}</div>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">U</div>
      </div>
    </header>
  );
}

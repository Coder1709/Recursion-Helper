
/* Enhanced Footer Component */
const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-indigo-100 text-indigo-800 p-3 shadow-inner margin-top-8">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <span className="text-sm font-medium">© {new Date().getFullYear()} Recursion Helper</span>
                <span className="text-xs text-indigo-500">Made with ❤️ by Arpit</span>
            </div>
        </footer>
    );
};

export { Footer };
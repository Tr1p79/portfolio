export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50/80 backdrop-blur-md border-t border-gray-200/20">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} Your Name. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              Email
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
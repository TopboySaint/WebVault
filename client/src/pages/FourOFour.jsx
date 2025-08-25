import { Link } from "react-router-dom";

export default function FourOFour() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-6">
			<section className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl p-10 border border-blue-100 text-center">
				<div className="text-6xl mb-3">🔍</div>
				<h1
					className="text-3xl sm:text-4xl font-extrabold text-blue-800 tracking-wide drop-shadow-lg"
					style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
				>
					404 — Page not found
				</h1>
				<p className="mt-3 text-blue-900/70">
					The page you’re looking for doesn’t exist or may have been moved.
				</p>
				<div className="mt-6 flex items-center justify-center gap-3">
					<Link
						to="/"
						className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white shadow-md hover:bg-blue-800 transition"
					>
						Go to Home
					</Link>
					<Link
						to="/signin"
						className="inline-flex items-center justify-center rounded-lg border border-blue-300 px-5 py-3 font-semibold text-blue-800 bg-white hover:bg-blue-50 transition"
					>
						Sign in
					</Link>
				</div>
				<p className="mt-6 text-xs text-gray-500">
					If you typed the address, check for typos.
				</p>
			</section>
		</main>
	);
}


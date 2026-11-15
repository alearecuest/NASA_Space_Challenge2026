import { APP_NAME } from '../config/constants'

export const Header = () => (
	<header className="bg-emerald-800 text-white">
		<div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5">
			<h1 className="text-2xl font-bold tracking-tight">{APP_NAME}</h1>
			<p className="text-sm text-emerald-100">
				Plan what to plant and how to rotate, using NASA Earth observation data.
			</p>
		</div>
	</header>
)
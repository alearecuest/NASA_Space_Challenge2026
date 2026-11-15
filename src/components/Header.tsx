export const Header = () => (
	<header className="border-b border-line bg-deep/80 backdrop-blur">
		<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
			<img src="/logo.svg" alt="Farm ClimeTech — Eyes in the sky, in the farmer's hands" className="h-11 w-auto sm:h-14" />
			<p className="hidden text-sm font-semibold text-sky md:block">
				Data: NASA SMAP, GPM, MODIS, NASA POWER
			</p>
		</div>
	</header>
)

export interface Config {
	port: number,
	root: string,
	path: {
		public: string,
		routes: string,
		plugins: string,
		strategy: string
	},
	env: string,
	session: Session,
	logConfig: Object,
	cache: Object,
	db: Object,
	ssoDB: Object,
	pushDB: Object,
	sessionDB: {
		client: string,
		connection: Object,
		timeout: number
	}
}

export interface Route {
	method: string|string[],
	path: string,
	handler?: Function
}

export interface Session {
	ttl: number,
	isSecure: boolean,
	isHttpOnly: boolean,
	path: string,
	domain: string,
	encoding: string
}

export interface RouteConfig {
	auth: any,
	pre?: any[],
	cache?: {
		expiresIn: number,
		privacy: string
	}
}


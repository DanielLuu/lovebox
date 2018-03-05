export const receiveUser = (user) => ({
	type: 'RECEIVE_USER',
	user
});

export const loadAdmin = (admin) => ({
	type: 'LOAD_ADMIN',
	admin
});

export const setAdmin = (admin) => ({
	type: 'SET_ADMIN',
	admin
});

export const receiveConfessions = (confessions) => ({
	type: 'RECEIVE_CONFESSIONS',
	confessions
});

export const receiveEvent = (event) => ({
	type: 'RECEIVE_EVENT',
	event
});

export const formChange = (field, value) => ({
	type: 'FORM_CHANGE',
	field,
	value
});

export const signupChange = (field, value) => ({
	type: 'SIGNUP_CHANGE',
	field,
	value
});

export const signinChange = (field, value) => ({
	type: 'SIGNIN_CHANGE',
	field,
	value
});

export const signin = (signin) => ({
	type: 'SIGNIN',
	signin
});

export const createChange = (field, value) => ({
	type: 'CREATE_CHANGE',
	field,
	value
});

export const createDone = (done) => ({
	type: 'CREATE_DONE',
	done
});

export const receiveProfileEvents = (events) => ({
	type: 'RECEIVE_PROFILE_EVENTS',
	events
});

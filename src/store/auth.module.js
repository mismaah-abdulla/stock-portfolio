const hostname = window.location.hostname
const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user}
  : { status: { loggedIn: false }, user: null};

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                let API_URL = `http://${hostname}:5000/login/${user.username}/${user.password}`
                try{
                    fetch(API_URL)
                    .then(response => {return response.json()})
                    .then(data => {
                        if (data.token) {
                            localStorage.setItem('user', JSON.stringify(data));
                            //console.log(data);
                            //console.log(JSON.stringify(data));
                            commit('loginSuccess', user);
                            resolve(user);
                        }else if (data == 'fail') {
                            commit('loginFailure');
                            reject(data);
                        }
                    })
                    .catch(e => {console.log("Response status: " + e)})
                }
                catch(error){
                    console.log(error);
                }
            })
        },
        logout({ commit }) {
            localStorage.removeItem('user');
            commit('logout');
        },
        register({ commit }, user) {
            return new Promise((resolve, reject) => {
                let API_URL = `http://${hostname}:5000/signup/${user.username}/${user.email}/${user.password}/${user.phoneNumber}`
                try{
                    fetch(API_URL)
                    .then(response => {return response.json()})
                    .then(data => {
                        console.log(data);
                        if (data == 'successful') {
                            alert('Successfully Created Account.');
                            commit('registerSuccess');
                            resolve(data);
                        }else if (data == 'username exists') {
                            alert('Username exists. Please enter another username.');
                            commit('registerFailure');
                            reject(data);
                        }else if (data == 'email exists') {
                            alert('Email exists. Please enter another email.');
                            commit('registerFailure');
                            reject(data);
                        }else if (data == 'phone exists') {
                            alert('Phone number exists. Please enter another phone number.');
                            commit('registerFailure');
                            reject(data);
                        }
                    })
                    .catch(e => {console.log("Response status: " + e)})
                }
                catch(error){
                    console.log(error);
                }
            })
        }
    },
    mutations: {
        loginSuccess(state, user) {
            state.status.loggedIn = true;
            state.user = user;
            console.log("loginSuccess: "+ JSON.stringify(user));
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        registerSuccess(state) {
            state.status.loggedIn = false;
        },
        registerFailure(state) {
            state.status.loggedIn = false;
        }
    }
};
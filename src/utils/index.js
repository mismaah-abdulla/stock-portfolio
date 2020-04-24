import Vue from 'vue'
import store from '../store'

export const EventBus = new Vue()

export function isValidJwt() {
    const user = localStorage.getItem('user');
    if (!user) {
        return false;
    }
    const data = JSON.parse(user);
    const jwt = data.token;
    if (!jwt || jwt.split('.').length < 3) {
        return false
    }
    //console.log("jwt:"+jwt);
    const payload = JSON.parse(atob(jwt.split('.')[1]))
    console.log(payload.user_id)
    const exp = new Date(payload.exp * 1000)
    const now = new Date()
    if (now < exp) {
        return true;
    } else {
        store.dispatch('auth/logout').then(
            () => {
                return false;
            },
            error => {
                console.log(error);
            }
        )
    }
}

export function getId() {
    const user = localStorage.getItem('user');
    if (!user) {
        return false;
    }
    const data = JSON.parse(user);
    const jwt = data.token;
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    const userId = payload.user_id;
    console.log(userId);
    return userId;
}
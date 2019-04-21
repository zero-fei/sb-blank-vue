import io from '../../untils/io';

const loginUrl = '/login';

const login = {
    state: {
        name: '游客'
    },
    mutations: {
        SET_INFO: (sate: object, payload: any) => {
            console.info('====> result', payload)
        }
    },
    actions: {
        Login({ commit } : any, user : object) {
            return new Promise((resolve, reject) => io({
                url: loginUrl,
                method: 'post',
                data: user,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }).then((result: any) => {
                if(result.statusText === 'OK') {
                    commit('SET_INFO', result.data)
                    resolve(result.statusText)
                } else {
                    reject(result.statusText)
                }
            }))

        },
        Logout() {
            return console.info(123)
        },
    }
};

export default login;
// @ts-ignore
import axios from '../../../library/axios/axios.min.js'

export const AddScore = (userId: number, score: number) => {
    try {
        return axios.get(`https://main.d12ofx71u78ebe.amplifyapp.com/api/challenge/score?userId=${userId}&score=${score}`)
    } catch (e) {
        return e
    }

}
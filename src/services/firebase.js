import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Ваші конфігурації Firebase
const firebaseConfig = {
	apiKey: 'AIzaSyB-wYuX3wf9C1V9kcjdGI8wz34dumFpSd0',
	authDomain: 'multyselect-form.firebaseapp.com',
	projectId: 'multyselect-form',
	storageBucket: 'multyselect-form.firebasestorage.app',
	messagingSenderId: '676947624252',
	appId: '1:676947624252:web:d3dcae2d69f965f6049e39',
	measurementId: 'G-08S76VH1PQ',
	databaseURL: 'https://multyselect-form-default-rtdb.firebaseio.com/' // Додайте це поле
}

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig)

// Ініціалізація Realtime Database
export const db = getDatabase(app)

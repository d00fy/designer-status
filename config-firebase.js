// Config file
import * as firebase from "firebase";
import 'firebase/storage' // <- add

export const firebaseConfig = {
    apiKey: "AIzaSyCDfZKLt2uOBr1Z90NMAjqqnrg4urMGIUY",
    authDomain: "designer-status.firebaseapp.com",
    databaseURL: "https://designer-status.firebaseio.com",
    projectId: "designer-status",
    storageBucket: "designer-status.appspot.com",
    messagingSenderId: "822308547609",
    appId: "1:822308547609:web:5261f97d054837b2edce88"
};

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
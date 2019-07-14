import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import vi from 'react-intl/locale-data/vi';

import axios from 'axios';

addLocaleData([...en, ...vi]);

// axios.defaults.baseURL = 'https://botbot-nlp-demo.herokuapp.com/';
// axios.defaults.baseURL = 'http://34.87.19.113/' // gcloud single instance
// axios.defaults.baseURL = 'http://35.194.209.225/' // gcloud kube cluster
axios.defaults.baseURL = 'http://localhost:5000/'
// axios.defaults.baseURL = 'http://botbot-nlp-demo.azurewebsites.net/'

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

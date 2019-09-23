import React, { Component } from 'react';

const logindetails ={
    email: "admin",
    password : "admin"
}

export function login(username,password) {
    return dispatch => {
        callLoginApi(username, password, error => {
            if (!error) {
                dispatch(setLoginSuccess(true));
            } else {
                dispatch(setLoginError(error));
            }
        });
    }
}

function setLoginSuccess(isLoginSuccess){
    return {
        type: 'SET_LOGIN_SUCCESS',
        isLoginSuccess
    };
}

function setLoginError(isLoginError) {
    return {
        type: 'SET_LOGIN_ERROR',
        isLoginError
    };
}

function callLoginApi(username, password, callback) {
    setTimeout(() => {
        if(username === logindetails.email && password === logindetails.password){
            return callback(null);
        }
        else
            return callback(new Error('Invalid username and password'));
    }, 1000);
}

export default function AllReducers(state = {
    isLoginSuccess : false,
    isLoginError : null
}, action) {
    switch(action.type){
        case 'SET_LOGIN_SUCCESS':
            return Object.assign({}, state, {
                isLoginSuccess: action.isLoginSuccess
            });
        case 'SET_LOGIN_ERROR':
            return Object.assign({}, state, {
                loginError: action.loginError
            });
        default:
            return state;
    }
}
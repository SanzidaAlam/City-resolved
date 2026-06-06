import React, { useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../Firebase/Firebase.init';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const signIn = (email, password) =>{
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    const signInWithGoogle =() =>{
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }
    const resetPass = (email) =>{
        setLoading(true)
        return sendPasswordResetEmail(auth, email)
    }
    const updateUser = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, 
            photoURL: photo
        }).then(() => {
            setUser((prevUser) => {
                return { ...prevUser, displayName: name, photoURL: photo };
            });
        }).catch((error) => {
            console.error("Profile update failed:", error);
            throw error;
        });
    };
    
    const logout = ()=>{
        return signOut(auth)
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
            setLoading(false)
        })
        return ()=>{
            unsubscribe()
        }
    },[])

    const authInfo = {
        createUser,
        signIn,
        signInWithGoogle,
        resetPass,
        updateUser,
        user,
        loading,
        logout 
    }
    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;
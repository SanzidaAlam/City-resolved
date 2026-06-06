import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../Components/Shared/Footer/Footer';
import Header from '../Components/Shared/Header';
import PageTransition from '../Components/Shared/PageTransition';
import GlobalGlow from '../Components/Shared/GlobalGlow';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <GlobalGlow/>
            <Header></Header>
            <main className="flex-grow">
                <PageTransition>
                    <Outlet></Outlet>
                </PageTransition>
            </main>
            
            <Footer className=''></Footer>
        </div>
    );
};

export default MainLayout;
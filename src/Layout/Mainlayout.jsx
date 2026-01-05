import React from 'react';
import { Outlet } from 'react-router';

const Mainlayout = () => {
    return (
        <div className='bg-gradient-to-br from-emerald-900 to-teal-700 h-[full]'>
         <main className='mx-auto w-11/12'>
        <Outlet />
      </main>    
        </div>
    );
};

export default Mainlayout;
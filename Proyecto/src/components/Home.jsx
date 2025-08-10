import React from 'react';
import Sidebar from '../components/Sidebar';
//import Topbar from '../components/Topbar';
import PostGrid from '../components/PostGrid';

const Home = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
   
        <PostGrid />
      </div>
    </div>
  );
};

export default Home;

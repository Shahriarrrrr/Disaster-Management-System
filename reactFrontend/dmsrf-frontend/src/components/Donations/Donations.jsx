import { useLoaderData } from "react-router";
import React, { useContext } from 'react';
import './Donations.css'
import { AuthContext } from "../../context/AuthContext";
import DonationList from "../DonationList/DonationList";

const Donations = () => {
    const { user, loading } = useContext(AuthContext);
    const {user_awards, user_total_donate} = user[0]
    const data = useLoaderData()
    const {donations} = data
    console.log(donations)
    return (
      <div className="bg-[#222831] pb-150">
                <div className="poppins-font h-screen bg-[#222831]">
            <div className="ml-[500px] w-[1000px] mt-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-8 mb-10 shadow-[0_10px_25px_rgba(102,126,234,0.5)] flex flex-wrap items-center justify-between transition-transform duration-300 ease-in-out hover:-translate-y-1">
  <div className="flex-1 min-w-[300px]">
    <div className="flex items-center text-[1.8rem] mb-1">
      <span className="ml-[100px]">Total Donations :</span>
    </div>
    <div className="mt-5">
      <div className="flex items-center mb-2">
        <div className="mr-2 ml-[100px]">#</div>
        <div>Number of Donations : {donations.length}</div>
      </div>
      <div className="flex items-center">
        <div className="mr-2 ml-[100px]">📧</div>
        <div>{user_awards}</div>
      </div>
    </div>
  </div>
  <div className="bg-transparent w-[250px] h-[200px] flex justify-center items-center">
        <div className=" px-3 py-1 rounded-full text-5xl ml-4">
        { user_total_donate}
      </div>
  </div>
</div>
<div className="">
  <DonationList donation={donations} user = {user}></DonationList>
</div>

        </div>

      </div>



    );
};

export default Donations;
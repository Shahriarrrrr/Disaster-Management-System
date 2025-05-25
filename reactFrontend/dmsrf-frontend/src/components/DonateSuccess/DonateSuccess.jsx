import React from 'react';
import { Link } from 'react-router';

const DonateSuccess = () => {
    return (
        <>
    <div className="container mx-auto px-4">
      {/* Success Message */}
      <div className="flex justify-center">
        <div className="w-full md:w-2/5">
          <div className="text-center shadow-lg p-11 w-full my-10 border-b-4 border-green-600">
            <i className="fa fa-check-circle text-5xl text-green-600" aria-hidden="true"></i>
            <h2 className="mt-2 mb-3 text-4xl font-medium leading-tight">Your Donation was successful</h2>
            <p className="text-lg text-gray-700 font-medium">
              Thank you for your donation. we will <br /> be in contact with more details shortly
            </p>
            <Link to='/' className='btn btn-primary mt-5'>Return Home</Link>
          </div>
        </div>
      </div>



    </div>
        </>
    );
};

export default DonateSuccess;
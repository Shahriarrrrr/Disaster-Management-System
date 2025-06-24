import React from 'react';

const LatestDonation = ({donation}) => {
    console.log(`Successsss : `, donation)
    const {donation_amount,donated_at, status,donation_cause_display} = donation
    const date = new Date(donated_at);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    return (

            <tr  className='ml-10'>
            <td className='text-white'>{formattedDate}</td>
            <td className='text-white'>{donation_cause_display}</td>
            <td className='text-white'>{donation_amount}</td>
            <td><span className="text-green-400">{status}</span></td>
            </tr>


    );
};

export default LatestDonation;
import React from 'react';

const LatestDonation = ({donation}) => {
    console.log(`Successsss : `, donation)
    const {donation_amount,donated_at, status,donation_cause_display} = donation
    const date = new Date(donated_at);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    return (

            <tr>
            <td>{formattedDate}</td>
            <td>{donation_cause_display}</td>
            <td>{donation_amount}</td>
            <td><span className="badge badge-success">{status}</span></td>
            </tr>


    );
};

export default LatestDonation;
import React from 'react';

const ProfileDonationCard = ({donation}) => {

    const {donated_at, donation_amount, donation_cause, donation_cause_display, donor_name, donor_remarks, status} = donation

    
    return (
          <div className="donation-card">
            <div className="donation-header">
              <div className="campaign-indicator hurricane"></div>
              <div className="donation-campaign">{donation_cause_display}</div>
              <div className="donation-date">{donated_at}</div>
            </div>
            <div className="donation-body">
              <div className="donation-value">{`${donation_amount}/-`}</div>
              <div>
                {status}
              </div>
            </div>
            <div className="donation-impact">
              <strong>Remarks:</strong> {donor_remarks}
            </div>
          </div>

    );
};

export default ProfileDonationCard;
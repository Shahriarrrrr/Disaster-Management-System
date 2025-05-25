import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Profile.css';
import { useLoaderData } from 'react-router';
import ProfileDonationCard from '../ProfileDonationCard/ProfileDonationCard';

const Profile = () => {
  const { user, loading } = useContext(AuthContext);
  const {donations} = useLoaderData();
  const successfulDonations = donations.filter(d => d.status === 'Success');
  console.log(successfulDonations)


  if (loading || !user || user.length === 0) {
    return <div>Loading...</div>;
  }
  console.log(`Profile` , user)
  const { email, groups, id, is_active, is_staff, is_superuser, last_login, user_address,
     user_age, user_awards, user_gender, user_last_donated_at, user_name, user_nid, user_permissions, 
     user_phone, user_profile_image, user_state, user_total_donate, user_type
} = user[0];
  // For demo purposes, assuming hardcoded values will be replaced later with actual user fields

  return (
    <div className='bg-[#222831]'>
      <div className="container">
        <div className="header ">
          <h1 className=''>PROFILE</h1>
          <p>Profile</p>
          <button className='btn btn-secondary'>Donate</button>
        </div>

        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-title">
              <span>{user_name || "JohnDonor"}</span>
              <div className="profile-badge">{user_awards}</div>
            </div>
            <div className="profile-details">
              <div className="profile-detail">
                <div className="detail-icon">📱</div>
                <div>{user_phone}</div>
              </div>
              <div className="profile-detail">
                <div className="detail-icon">📧</div>
                <div>{email}</div>
              </div>
            </div>
          </div>

          <div className="donation-total">
            <div className="donation-amount">{`${user_total_donate}/-`}</div>
            <div>Total Donated</div>
          </div>
        </div>

        <h2 style={{ marginBottom: '20px', color: '#2d3748' }}>Your Donations</h2>
        <div className="card-grid">

            
          {/* Repeatable donation card block */}
          {
            successfulDonations.slice(0,3).map(donation => <ProfileDonationCard donation = {donation}></ProfileDonationCard>)
          }

        </div>

        <h2 style={{ marginBottom: '20px', color: '#2d3748' }}>Your Impact</h2>
        <div className="card-grid">
          <div className="impact-card">
            <div className="impact-icon">🏠</div>
            <div className="impact-number">120</div>
            <div className="impact-label">Families Helped</div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">🍲</div>
            <div className="impact-number">450</div>
            <div className="impact-label">Meals Provided</div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">🏥</div>
            <div className="impact-number">25</div>
            <div className="impact-label">Shelters Supported</div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">🌍</div>
            <div className="impact-number">4</div>
            <div className="impact-label">Disasters Responded To</div>
          </div>
        </div>
      </div>

      <div className="footer">
        © 2023 Disaster Relief Foundation. All rights reserved.
      </div>
    </div>
  );
};

export default Profile;

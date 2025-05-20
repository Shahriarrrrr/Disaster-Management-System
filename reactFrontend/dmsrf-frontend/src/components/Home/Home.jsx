import React, { useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { Link, useLoaderData } from 'react-router';
import LatestDonation from '../LatestDonation/LatestDonation';
import LatestCampaigns from '../LatestCampaigns/LatestCampaigns';

const Home = () => {
  const { user, loading } = useContext(AuthContext);
  const {donations, causes} = useLoaderData();
  const successfulDonations = donations.filter(d => d.status === 'Success');
  console.log(successfulDonations)// can be fixed 
  console.log(causes)

  if (loading) return <p>Loading user info...</p>;
  if (!user || user.length === 0) return <p>No user data</p>;


  const currentUser = user[0]; // assuming user is an array
  const {user_total_donate, user_name} = currentUser
  console.log(currentUser)

  return (
    <div className='min-h-screen bg-stone-300'>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid gap-6">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome back, <span id="welcome-text">{user_name}</span></h1>
              <p className="text-base-content/70">Your generosity is making a difference.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <a className="btn btn-success" href="donationHandler.html">Donate</a>

            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat bg-base-100 shadow-md rounded-box">
              <div className="stat-figure text-primary">
                <i className="fas text-2xl">৳</i>
              </div>
              <div className="stat-title">Total Donated</div>
              <div id="Total-Donation" className="stat-value text-primary">{user_total_donate}</div>
              <div className="stat-desc">Since January 2023</div>
            </div>
            <div className="stat bg-base-100 shadow-md rounded-box">
              <div className="stat-figure text-secondary">
                <i className="fas fa-hands-helping text-2xl"></i>
              </div>
              <div className="stat-title">Tier</div>
              <div id="tier" className="stat-value text-secondary">12</div>
              <div className="stat-desc">↗︎ 3 (30%) more than last year</div>
            </div>
            <div className="stat bg-base-100 shadow-md rounded-box">
              <div className="stat-figure text-accent">
                <i className="fas fa-users text-2xl"></i>
              </div>
              <div className="stat-title">People Helped</div>
              <div className="stat-value text-accent">~1,200</div>
              <div className="stat-desc">Through your contributions</div>
            </div>
            <div className="stat bg-base-100 shadow-md rounded-box">
              <div className="stat-figure text-info">
                <i className="fas fa-map-marker-alt text-2xl"></i>
              </div>
              <div className="stat-title">Countries Reached</div>
              <div className="stat-value text-info">8</div>
              <div className="stat-desc">Global impact</div>
            </div>
          </div>


          <div className="bg-base-100 p-6 rounded-box shadow-md">
            <h2 className="text-xl font-bold mb-4">Your Donation History</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Campaign</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="donation-table-body">
                  {
                    successfulDonations.slice(0,3).map(donation => <LatestDonation donation = {donation}></LatestDonation>)
                  }
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">

              <Link className="btn btn-ghost btn-sm" to='/donations'>View All Donations</Link>
            </div>
          </div>

          <h2 className="text-xl font-bold mt-2">Active Campaigns</h2>
          <progress className="progress progress-success w-40"></progress>
          <div id="campaign-container" className="bg-amber-50  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {
            causes.map(campaign => <LatestCampaigns campaign = {campaign}></LatestCampaigns>)
          }
          </div>


          <div className="bg-base-100 p-6 rounded-box shadow-md mt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <h2 className="text-xl font-bold mb-4">Become a Volunteer</h2>
                <p className="mb-4">
                  Join our team of dedicated volunteers and make a direct impact in disaster-affected areas. We need
                  people with various skills and backgrounds.
                </p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>On-site disaster response</li>
                  <li>Medical assistance</li>
                  <li>Logistics and distribution</li>
                  <li>Remote support and coordination</li>
                  <li>Fundraising and awareness</li>
                </ul>
                <div className="flex gap-4 mt-6">
                  <button className="btn btn-primary" id="volunteer-btn">Apply Now</button>
                  <button className="btn btn-outline">Learn More</button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img src="https://placehold.co/500x300" alt="Volunteers working" className="rounded-lg w-full h-full object-cover"/>
              </div>
            </div>
          </div>


          <dialog id="volunteer_modal" className="modal">
            <div className="modal-box w-11/12 max-w-3xl">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <h3 className="font-bold text-lg mb-4">Volunteer Application</h3>
              <form id="volunteer-form" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input type="text" placeholder="Full Name" className="input input-bordered" required />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input type="email" placeholder="Email" className="input input-bordered" required />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input type="tel" placeholder="Phone Number" className="input input-bordered" required />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <input type="text" placeholder="City, Country" className="input input-bordered" required />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Areas of Interest</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox" />
                      <span className="label-text">Disaster Response</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox" />
                      <span className="label-text">Medical Aid</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox" />
                      <span className="label-text">Logistics</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox" />
                      <span className="label-text">Fundraising</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox" />
                      <span className="label-text">Remote Support</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox" />
                      <span className="label-text">Education</span>
                    </label>
                  </div>
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Skills & Experience</span>
                  </label>
                  <textarea className="textarea textarea-bordered h-24" placeholder="Tell us about your relevant skills and experience"></textarea>
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Availability</span>
                  </label>
                  <select className="select select-bordered w-full">
                    <option disabled selected>Select your availability</option>
                    <option>Weekdays</option>
                    <option>Weekends</option>
                    <option>Evenings</option>
                    <option>Full-time</option>
                    <option>On-call for emergencies</option>
                  </select>
                </div>
                <div className="form-control md:col-span-2 mt-4">
                  <button type="submit" className="btn btn-primary">Submit Application</button>
                </div>
              </form>
            </div>
          </dialog>


          <h2 className="text-xl font-bold mt-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-box text-center min-w-16">
                    <div className="text-primary font-bold text-xl">15</div>
                    <div className="text-sm">May</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Disaster Preparedness Workshop</h3>
                    <div className="flex items-center gap-1 text-sm text-base-content/70 mt-1">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>Community Center, Downtown</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-base-content/70 mt-1">
                      <i className="fas fa-calendar"></i>
                      <span>10:00 AM - 2:00 PM</span>
                    </div>
                    <p className="mt-2">Learn essential skills for preparing your family for natural disasters.</p>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-outline btn-sm">RSVP</button>
                </div>
              </div>
            </div>
            

            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-box text-center min-w-16">
                    <div className="text-primary font-bold text-xl">22</div>
                    <div className="text-sm">May</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Fundraising Gala Dinner</h3>
                    <div className="flex items-center gap-1 text-sm text-base-content/70 mt-1">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>Grand Hotel Ballroom</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-base-content/70 mt-1">
                      <i className="fas fa-calendar"></i>
                      <span>7:00 PM - 10:00 PM</span>
                    </div>
                    <p className="mt-2">Annual fundraising event with special guests and entertainment.</p>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-outline btn-sm">RSVP</button>
                </div>
              </div>
            </div>
            

            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-box text-center min-w-16">
                    <div className="text-primary font-bold text-xl">29</div>
                    <div className="text-sm">May</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Volunteer Training Session</h3>
                    <div className="flex items-center gap-1 text-sm text-base-content/70 mt-1">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>Relief Fund Headquarters</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-base-content/70 mt-1">
                      <i className="fas fa-calendar"></i>
                      <span>9:00 AM - 12:00 PM</span>
                    </div>
                    <p className="mt-2">Training for new volunteers joining our emergency response teams.</p>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-outline btn-sm">RSVP</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

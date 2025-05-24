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
  const {user_total_donate, user_name, user_awards} = currentUser
  console.log(currentUser)

  return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid gap-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Welcome back,{" "}
                <span id="welcome-text" className="text-blue-600">
                  {user_name}
                </span>
              </h1>
              <p className="text-slate-500 mt-1">Your generosity is making a difference.</p>
            </div>
            <div className="mt-4 md:mt-0">
              
              <Link to= '/donatePage'
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
                href="donationHandler.html"
              >
                <span>Donate</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stat bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-slate-500 text-sm font-medium mb-1">Total Donated</div>
                  <div id="Total-Donation" className="text-3xl font-bold text-blue-600">
                    {user_total_donate}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Since January 2023</div>
                </div>
                <div className="stat-figure bg-blue-50 p-3 rounded-xl text-blue-500">
                  <i className="fas text-xl">৳</i>
                </div>
              </div>
            </div>

            <div className="stat bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-slate-500 text-sm font-medium mb-1">Tier</div>
                  <div id="tier" className="text-3xl font-bold text-purple-600">
                    {user_awards}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-500 mr-1"
                    >
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                    <span>3 (30%) more than last year</span>
                  </div>
                </div>
                <div className="stat-figure bg-purple-50 p-3 rounded-xl text-purple-500">
                  <i className="fas fa-hands-helping text-xl"></i>
                </div>
              </div>
            </div>

            <div className="stat bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-slate-500 text-sm font-medium mb-1">People Helped</div>
                  <div className="text-3xl font-bold text-amber-600">~1,200</div>
                  <div className="text-xs text-slate-400 mt-1">Through your contributions</div>
                </div>
                <div className="stat-figure bg-amber-50 p-3 rounded-xl text-amber-500">
                  <i className="fas fa-users text-xl"></i>
                </div>
              </div>
            </div>

            <div className="stat bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-slate-500 text-sm font-medium mb-1">Countries Reached</div>
                  <div className="text-3xl font-bold text-teal-600">8</div>
                  <div className="text-xs text-slate-400 mt-1">Global impact</div>
                </div>
                <div className="stat-figure bg-teal-50 p-3 rounded-xl text-teal-500">
                  <i className="fas fa-map-marker-alt text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Donation History */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Your Donation History</h2>
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">Recent</div>
            </div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Campaign</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody id="donation-table-body">
                  {successfulDonations.slice(0, 3).map((donation, index) => (
                    <LatestDonation key={index} donation={donation} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-right">
              <Link
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center transition-colors duration-200"
                to="/donations"
              >
                View All Donations
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Active Campaigns */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Active Campaigns</h2>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm text-slate-500">Live updates</span>
              </div>
            </div>
            <div className="relative h-2 w-full bg-slate-100 rounded-full mb-8 overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-3/4"></div>
            </div>
            <div id="campaign-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {causes.map((campaign, index) => (
                <LatestCampaigns key={index} campaign={campaign} />
              ))}
            </div>
          </div>

          {/* Volunteer Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Become a Volunteer</h2>
                <p className="text-slate-600 mb-6">
                  Join our team of dedicated volunteers and make a direct impact in disaster-affected areas. We need
                  people with various skills and backgrounds.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "On-site disaster response",
                    "Medical assistance",
                    "Logistics and distribution",
                    "Remote support and coordination",
                    "Fundraising and awareness",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-emerald-500"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4 mt-6">
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    id="volunteer-btn"
                  >
                    Apply Now
                  </button>
                  <button className="px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all duration-200">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 h-full min-h-[300px]">
                <img
                  src="https://placehold.co/500x300"
                  alt="Volunteers working"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Volunteer Modal - Keeping the same structure */}
          <dialog id="volunteer_modal" className="modal">
            <div className="modal-box w-11/12 max-w-3xl bg-white rounded-2xl shadow-lg p-6">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <h3 className="font-bold text-xl mb-6 text-slate-800">Volunteer Application</h3>
              <form id="volunteer-form" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-slate-700 font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="input input-bordered w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-slate-700 font-medium">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="input input-bordered w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-slate-700 font-medium">Phone</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="input input-bordered w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-slate-700 font-medium">Location</span>
                  </label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    className="input input-bordered w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-slate-700 font-medium">Areas of Interest</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "Disaster Response",
                      "Medical Aid",
                      "Logistics",
                      "Fundraising",
                      "Remote Support",
                      "Education",
                    ].map((area, index) => (
                      <label key={index} className="label cursor-pointer justify-start gap-2">
                        <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" />
                        <span className="label-text text-slate-700">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-slate-700 font-medium">Skills & Experience</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24 w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Tell us about your relevant skills and experience"
                  ></textarea>
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-slate-700 font-medium">Availability</span>
                  </label>
                  <select className="select select-bordered w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all">
                    <option disabled selected>
                      Select your availability
                    </option>
                    <option>Weekdays</option>
                    <option>Weekends</option>
                    <option>Evenings</option>
                    <option>Full-time</option>
                    <option>On-call for emergencies</option>
                  </select>
                </div>
                <div className="form-control md:col-span-2 mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </dialog>

          {/* Upcoming Events */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  day: "15",
                  month: "May",
                  title: "Disaster Preparedness Workshop",
                  location: "Community Center, Downtown",
                  time: "10:00 AM - 2:00 PM",
                  description: "Learn essential skills for preparing your family for natural disasters.",
                },
                {
                  day: "22",
                  month: "May",
                  title: "Fundraising Gala Dinner",
                  location: "Grand Hotel Ballroom",
                  time: "7:00 PM - 10:00 PM",
                  description: "Annual fundraising event with special guests and entertainment.",
                },
                {
                  day: "29",
                  month: "May",
                  title: "Volunteer Training Session",
                  location: "Relief Fund Headquarters",
                  time: "9:00 AM - 12:00 PM",
                  description: "Training for new volunteers joining our emergency response teams.",
                },
              ].map((event, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-50 p-3 rounded-xl text-center min-w-16 flex flex-col items-center">
                        <div className="text-blue-600 font-bold text-xl">{event.day}</div>
                        <div className="text-sm text-blue-500">{event.month}</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{event.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-slate-500 mt-2">
                          <i className="fas fa-map-marker-alt text-slate-400"></i>
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                          <i className="fas fa-calendar text-slate-400"></i>
                          <span>{event.time}</span>
                        </div>
                        <p className="mt-3 text-slate-600">{event.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button className="px-4 py-2 border border-slate-200 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm">
                        RSVP
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

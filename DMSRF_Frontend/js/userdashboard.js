document.addEventListener("DOMContentLoaded", function () {
    // === Utility: Capitalize words ===
    function capitalizeFull(str) {
      return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  
    // === Reusable API fetch with auto-refresh ===
    async function apiFetch(url, options = {}) {
      const accessToken = localStorage.getItem('access_token');
      options.headers = {
        ...(options.headers || {}),
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };
  
      let response = await fetch(url, options);
  
      if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          const newAccessToken = localStorage.getItem('access_token');
          options.headers['Authorization'] = `Bearer ${newAccessToken}`;
          response = await fetch(url, options);
        } else {
          window.location.href = '/login'; // Redirect or show login modal
          return;
        }
      }
  
      return response;
    }
  
    async function refreshToken() {
      try {
        const response = await fetch('http://127.0.0.1:8000/account/api/token/refresh/', {
          method: 'POST',
          credentials: 'include' // Only if using cookie-based refresh
        });
  
        if (!response.ok) return false;
  
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return true;
      } catch (err) {
        console.error('Token refresh failed', err);
        return false;
      }
    }
  
    // === Volunteer Modal ===
    const volunteerBtn = document.getElementById("volunteer-btn");
    const volunteerModal = document.getElementById("volunteer_modal");
    const volunteerForm = document.getElementById("volunteer-form");
  
    if (volunteerBtn && volunteerModal) {
      volunteerBtn.addEventListener("click", function () {
        volunteerModal.showModal();
      });
    }
  
    if (volunteerForm) {
      volunteerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Thank you for your interest in volunteering! We will contact you soon.");
        volunteerModal.close();
      });
    }
  
    // === Mobile Drawer ===
    const drawerToggle = document.getElementById("my-drawer-2");
    const menuLinks = document.querySelectorAll(".drawer-side .menu a");
  
    menuLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 1024) {
          drawerToggle.checked = false;
        }
      });
    });
    
    // === Fetch User Profile ===
    apiFetch('http://127.0.0.1:8000/account/api/users/')
      .then(response => response.json())
      .then(userData => {
        const user = userData[0];
        const name = capitalizeFull(user.user_name);
        const donationAmount = user.user_total_donate;
        const tier = user.user_awards;
        const profileImage = user.user_profile_image;
  
        document.getElementById('profile-name-nav').textContent = name;
        document.getElementById('welcome-text').textContent = name;
        document.getElementById('Total-Donation').textContent = donationAmount;
        document.getElementById('tier').textContent = tier;
        document.getElementById('profile-image').src = profileImage;
        document.getElementById('big-profile-image').src = profileImage;
      })
      .catch(error => console.error('Error fetching user:', error));
  
    // === Fetch Donations ===
    apiFetch('http://127.0.0.1:8000/donation/api/donation/')
      .then(response => response.json())
      .then(donations => {
        const tableBody = document.getElementById('donation-table-body');
        tableBody.innerHTML = '';
  
        const successfulDonations = donations.filter(d => d.status === 'Success');
        successfulDonations.sort((a, b) => new Date(b.donated_at) - new Date(a.donated_at));
        const latestDonations = successfulDonations.slice(0, 3);
  
        latestDonations.forEach(donation => {
          const tr = document.createElement('tr');
          const date = new Date(donation.donated_at);
          const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          const amount = `${parseFloat(donation.donation_amount).toFixed(2)} ৳`;
          const cause = donation.donation_cause_display || 'N/A';
          const status = donation.status || 'Completed';
  
          tr.innerHTML = `
            <td>${formattedDate}</td>
            <td>${cause}</td>
            <td>${amount}</td>
            <td><span class="badge badge-success">${status}</span></td>
          `;
  
          tableBody.appendChild(tr);
        });
      })
      .catch(error => console.error('Error fetching donations:', error));
  
    // === Fetch Campaigns ===
    apiFetch('http://127.0.0.1:8000/api/campaigns/')
      .then(response => response.json())
      .then(campaigns => {
        const latestCampaigns = campaigns.slice(0, 3);
        const campaignContainer = document.getElementById('campaign-container');
        campaignContainer.innerHTML = '';
  
        latestCampaigns.forEach(campaign => {
          const latestUpdate = campaign.updates?.[campaign.updates.length - 1] || null;
          const collected = latestUpdate ? latestUpdate.total_collected : 0;
          const goal = campaign.goal_amount || 0;
          const percentage = goal > 0 ? Math.min(100, Math.floor((collected / goal) * 100)) : 0;
  
          const div = document.createElement('div');
          div.className = 'bg-black text-white shadow-md rounded-lg p-4 border flex flex-col justify-between h-full';
  
          div.innerHTML = `
            <h3 class="text-lg font-semibold mb-2">${campaign.title}</h3>
            <p class="text-white-600 mb-2 flex-grow">${campaign.description || 'No description provided.'}</p>
            <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div class="bg-green-500 h-3 rounded-full " style="width: ${percentage}%"></div>
            </div>
            <div class="flex gap-64">
              <p class="text-sm text-white-700">raised ${collected.toLocaleString()} ৳</p>
              <p class="text-sm text-white-700">${goal.toLocaleString()} ৳ goal</p>
            </div>
            
            <button class="text-xl btn btn-success mt-auto w-1/5">Donate</button>
          `;
  
          campaignContainer.appendChild(div);
        });
      })
      .catch(error => console.error('Error fetching campaigns:', error));


      //LiveTotalDonation
  
  });
  

  
      
    // // === General Donation Submission ===
    // const generalDonateBtn = document.getElementById("donateBtn");
    // const modalCheckbox = document.getElementById("my_modal_7");
  
    // if (generalDonateBtn) {
    //   console.log("Donate button found, attaching event listener");
  
    //   generalDonateBtn.addEventListener("click", async function(e) {
    //     console.log("Donate button clicked");
    //     e.preventDefault(); // Prevent form submission
  
    //     // Disable button to prevent multiple clicks
    //     generalDonateBtn.disabled = true;
    //     generalDonateBtn.classList.add("opacity-50");
    //     generalDonateBtn.textContent = "Processing...";
  
    //     const amountField = document.getElementById("general-donation-amount");
    //     const remarksField = document.getElementById("general-donation-amount-remarks");
  
    //     const amount = parseFloat(amountField.value);
    //     const remarks = remarksField ? remarksField.value.trim() : "";
  
    //     console.log("Amount:", amount, "Remarks:", remarks);
  
    //     if (!amount || isNaN(amount) || amount <= 0) {
    //       showMessage("Please enter a valid donation amount.");
    //       resetButton();
    //       return;
    //     }
  
    //     if (amount > 100000) {
    //       showMessage("Donation amount cannot exceed 100,000 Taka.");
    //       resetButton();
    //       return;
    //     }
  
    //     const payload = {
    //       donation_cause: 3,
    //       donation_amount: amount,
    //       donor_remarks: remarks
    //     };
  
    //     console.log("Sending payload:", payload);
  
    //     try {
    //       const accessToken = localStorage.getItem('access_token');
    //       console.log(accessToken)
    //       const response = await fetch("http://127.0.0.1:8000/donation/api/donation/initiate/", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Authorization": `Bearer ${accessToken}`
    //         },
    //         body: JSON.stringify(payload)
    //       });
  
    //       console.log('Here IS THE RESPONSE: ', response);
  
    //       if (!response.ok) {
    //         const errData = await response.json();
    //         console.error("Donation failed:", errData);
    //         showMessage("Something went wrong with your donation. Please try again.");
    //         resetButton();
    //         return;
    //       }
  
    //       const data = await response.json();
    //       console.log("Response data:", data);
  
    //       if (data.payment_url) {
    //         console.log('Received payment URL:', data.payment_url);
  
    //         // Close modal before redirect if present
    //         if (modalCheckbox) {
    //           modalCheckbox.checked = false;
    //         }
  
    //         // Force a small delay to ensure modal closing is processed
    //         setTimeout(() => {
    //           console.log("Attempting redirect with window.location.href");
  
    //           // Try multiple redirect methods
    //           try {
    //             window.location.href = data.payment_url;
  
    //             setTimeout(() => {
    //               console.log("First redirect method may have failed, trying window.location.assign");
    //               window.location.assign(data.payment_url);
  
    //               setTimeout(() => {
    //                 console.log("Second redirect method may have failed, trying window.open");
    //                 const newWindow = window.open(data.payment_url, "_self");
  
    //                 if (!newWindow) {
    //                   console.error("Popup blocked or all redirect methods failed");
    //                   showMessage("Redirect failed. Please try manually going to: " + data.payment_url);
    //                   resetButton();
    //                 }
    //               }, 500);
    //             }, 500);
    //           } catch (redirectError) {
    //             console.error("Error during redirect:", redirectError);
    //             showMessage("Redirect failed. Please try again or contact support.");
    //             resetButton();
    //           }
    //         }, 200);
    //       } else {
    //         console.error("No payment URL received");
    //         showMessage("Failed to get payment details. Please contact support.");
    //         resetButton();
    //       }
  
    //     } catch (error) {
    //       console.error("Donation request failed:", error);
    //       showMessage("Failed to process donation. Please try again later.");
    //       resetButton();
    //     }
    //   });
    // } else {
    //   console.error("Donate button not found in the DOM");
    // }
  
    // function resetButton() {
    //   if (generalDonateBtn) {
    //     generalDonateBtn.disabled = false;
    //     generalDonateBtn.classList.remove("opacity-50");
    //     generalDonateBtn.textContent = "Donate";
    //   }
    // }
  
    // function showMessage(message) {
    //   alert(message); // Replace with custom toast or modal if desired
    // }  
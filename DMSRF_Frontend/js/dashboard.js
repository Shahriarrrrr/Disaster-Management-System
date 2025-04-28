document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('access_token');
  
    if (!token) {
      // Redirect to login if no token
      window.location.href = '/login.html';
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/campaigns/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert(data[0].title);
        //Manipulation starts here
      } else {
        // Token might be expired or invalid
        console.log('Token might be invalid or expired.');
        window.location.href = '/login.html';
      }
  
    } catch (error) {
      console.error('Error fetching protected data:', error);
      window.location.href = '/login.html';
    }
  });
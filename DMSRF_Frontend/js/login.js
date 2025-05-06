window.addEventListener('load', () => {
    document.body.classList.add('fade-in');
  });

  document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const form = e.target;
    const formData = new FormData(form);
  
    const data = {
      email: formData.get('email'),
      password: formData.get('password')
    };
  
    try {
      console.log(data)
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Access Token:', result.access);
        console.log('Refresh Token:', result.refresh);
  
        // Store tokens in localStorage or cookies
        localStorage.setItem('access_token', result.access);
        localStorage.setItem('refresh_token', result.refresh);
  
        // Redirect or show success
        //alert('Login successful!');
        window.location.href = 'http://127.0.0.1:5500/DMSRF/DMSRF_Frontend/html/userdashboard.html';
      } else {
        const err = await response.json();
        alert('Login failed: ' + (err.detail || 'Check your credentials.'));
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Something went wrong!');
    }
  });
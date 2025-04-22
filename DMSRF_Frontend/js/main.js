document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".nav-link");
  
    links.forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        document.body.classList.add("fade-out");
  
        setTimeout(() => {
          window.location.href = this.href;
        }, 500); // Match your fade-out duration
      });
    });
  });
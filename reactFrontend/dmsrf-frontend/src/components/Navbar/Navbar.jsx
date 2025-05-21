import React, { useEffect } from 'react';
import './navbar.css';
import { IonIcon } from '@ionic/react';
import {
  homeOutline,
  personOutline,
  chatbubblesOutline,
  barChartOutline,
  cartOutline,
  settingsOutline,
  logOutOutline,
  logoApple,
} from 'ionicons/icons';
import { Link } from 'react-router';

const Navbar = () => {
  useEffect(() => {
    const menu = document.querySelector('.menu');
    const sidebar = document.querySelector('.sidebar');
    const Menulist = document.querySelectorAll('.Menulist li');

    menu.onclick = () => {
      menu.classList.toggle('active');
      sidebar.classList.toggle('active');
    };

    Menulist.forEach((item) =>
      item.addEventListener('click', function () {
        Menulist.forEach((item) => item.classList.remove('active'));
        this.classList.add('active');
      })
    );
  }, []);

  return (
    <>
      <div className="menu"></div>

      <div className="sidebar">
        <ul>
          <li className="logo" style={{ '--bg': '#333' }}>
            <a href="#">
              <div className="icon">
                <IonIcon icon={logoApple} />
              </div>
              <div className="text">Website Logo</div>
            </a>
          </li>
          <div className="Menulist">
            <li style={{ '--bg': '#f44336' }} className="active">
              
              <Link to="/">
                <div className="icon">
                  <IonIcon icon={homeOutline} />
                </div>
                <div className="text">Home</div>
              </Link>
            </li>
            <li style={{ '--bg': '#ffa117' }}>
              <Link to='/profile'>
              <div className='icon'> 
                <IonIcon icon={personOutline} />
              </div>
              <div className="text">Profile</div>
              </Link>
            </li>
            <li style={{ '--bg': '#0fc70f' }}>
              <a href="#">
                <div className="icon">
                  <IonIcon icon={chatbubblesOutline} />
                </div>
                <div className="text">Inbox</div>
              </a>
            </li>
            <li style={{ '--bg': '#2196f3' }}>
              <a href="#">
                <div className="icon">
                  <IonIcon icon={barChartOutline} />
                </div>
                <div className="text">Analytics</div>
              </a>
            </li>
            <li style={{ '--bg': '#76d7c4' }}>
              <a href="#">
                <div className="icon">
                  <IonIcon icon={cartOutline} />
                </div>
                <div className="text">Order</div>
              </a>
            </li>
            <li style={{ '--bg': '#e91e63' }}>
              <a href="#">
                <div className="icon">
                  <IonIcon icon={settingsOutline} />
                </div>
                <div className="text">Settings</div>
              </a>
            </li>
          </div>
          <div className="bottom">
            <li style={{ '--bg': '#333' }}>
              <a href="#">
                <div className="icon">
                  <div className="imgbx">
                    <img src="/pro.png" alt="Profile" />
                  </div>
                </div>
                <div className="text">Tintin</div>
              </a>
            </li>
            <li style={{ '--bg': '#333' }}>
              <a href="#">
                <div className="icon">
                  <IonIcon icon={logOutOutline} />
                </div>
                <div className="text">Logout</div>
              </a>
            </li>
          </div>
        </ul>
      </div>
    </>
  );
};

export default Navbar;

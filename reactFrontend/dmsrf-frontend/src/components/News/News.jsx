import React from 'react';
import './News.css'
const News = () => {
    return (
<div
      className="bg-cream font-sans"
      style={{
        fontFamily: "'Inter', sans-serif",
        '--cream': '#f5f5f4',
        '--navy': '#1e3a8a',
        '--gold': '#d4af37',
      }}
    >
      {/* Header */}
      <header className="bg-navy text-white shadow-lg py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1
            className="text-4xl font-bold font-serif"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            DMSRF
          </h1>
          <input
            type="text"
            placeholder="Search disaster news..."
            className="border border-gray-200 rounded-lg px-4 py-2 w-64 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-gold"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Top Story */}
        <section className="mb-12">
          <h2
            className="text-4xl font-bold text-navy mb-6 font-serif"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Featured News
          </h2>
          <article className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in border border-gray-100 card-hover">
            <div className="relative w-full h-80 bg-gradient-to-br from-gray-200 to-gray-400 mb-6 rounded-lg image-placeholder transform hover:scale-110 transition-transform duration-300" />
            <h3
              className="text-3xl font-semibold text-navy mb-3 font-serif"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Hurricane Alpha Devastates Coastal Regions
            </h3>
            <p className="text-gray-600 mb-4 text-lg">
              A Category 4 hurricane has displaced thousands, causing widespread damage across coastal areas. Relief efforts are underway to provide critical support...
            </p>
            <a
              href="#"
              className="text-gold hover:text-yellow-600 font-medium text-lg hover:underline"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Read More
            </a>
          </article>
        </section>

        {/* News Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Earthquake Recovery Efforts Intensify',
              content: 'A 7.2 magnitude earthquake has caused significant destruction. Recovery initiatives are mobilizing to rebuild affected communities...',
              category: 'funds',
            },
            {
              title: 'Flood Preparedness Guidelines Released',
              content: 'New guidelines offer strategies for flood preparedness, including evacuation plans and emergency kit essentials...',
              category: 'resources',
            },
            {
              title: 'Wildfire Threatens Western Regions',
              content: 'A massive wildfire is spreading rapidly, prompting evacuations and urgent response from relief teams...',
              category: 'disasters',
            },
          ].map((article, index) => (
            <article
              key={index}
              className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in border border-gray-100 card-hover"
              data-category={article.category}
            >
              <div className="relative w-full h-48 bg-gradient-to-br from-gray-200 to-gray-400 mb-4 rounded-lg image-placeholder transform hover:scale-110 transition-transform duration-300" />
              <h3
                className="text-2xl font-semibold text-navy mb-2 font-serif"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                {article.title}
              </h3>
              <p className="text-gray-600 mb-4">{article.content}</p>
              <a
                href="#"
                className="text-gold hover:text-yellow-600 font-medium hover:underline"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Read More
              </a>
            </article>
          ))}
        </section>
      </main>
    </div>
    );
};

export default News;
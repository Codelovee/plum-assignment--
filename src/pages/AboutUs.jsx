const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          About Us
        </h1>
        <p className="text-gray-700 text-lg mb-4 leading-relaxed">
          Welcome to <span className="font-semibold">WellnessAI</span>, your
          personal AI-powered wellness companion. Our goal is to help you live a
          healthier, happier life by providing personalized wellness tips
          tailored to your needs.
        </p>
        <p className="text-gray-700 text-lg mb-4 leading-relaxed">
          Whether your focus is on improving sleep, reducing stress, building
          muscle, losing weight, or enhancing mental clarity, we offer practical
          guidance and easy-to-follow steps that fit into your daily routine.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          Our team is passionate about combining AI technology with wellness
          expertise to make health accessible, engaging, and fun for everyone.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;

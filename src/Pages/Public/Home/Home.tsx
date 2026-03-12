import './Home.css'

const Home = () => {
  return (
    <div className="home-content">
      <header className="hero-branding">
        <h1>Iter Viae</h1>
        <h2 className="subtitle">The Way Of The Road</h2>
      </header>

      <section className="manifesto">
        <p>
          Welcome to **Iter Viae**. I am building a specialized planner designed to complement 
          your standard navigation tools, providing the granular control needed to truly 
          map out your journey. This is a personal hobby so there is no garentees nor should you expect a final version of this. 
        </p>
        <p>
          My vision is to evolve into an encompassing platform for the motorcycle community—a 
          digital space to share hidden gems, technical routes, and the camaraderie of the open road.
        </p>
      </section>

      <div className="status-box">
        <h3>Development Status: Restricted Access</h3>
        <p>
          Due to API integration costs and ongoing development, certain features are currently 
          locked to a limited number of testers. We appreciate your patience as we scale.
        </p>
      </div>

      <div className="cta-area">
        <button className="std-button">Begin your Journey</button>
      </div>
    </div>
  )
}

export default Home

//TODO: Need to have the Begin Your Journey Lead to the Login Page
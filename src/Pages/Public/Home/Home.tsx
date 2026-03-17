import './Home.css'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="home-content">
      <header className="hero-branding">
        <h1>Iter Viae</h1>
        <h2 className="subtitle">The Way Of The Road</h2>
      </header>

      <section className="manifesto">
        <p>
          Welcome to <strong>Iter Viae</strong>. We are building a specialized route planner designed to complement 
          your standard navigation tools, providing the granular control required to truly 
          map out your ultimate journey. 
        </p>
        <p>
          Our vision is to evolve into a comprehensive platform for the motorcycle community—a 
          digital hub dedicated to sharing hidden gems, technical routes, and the true camaraderie of the open road.
        </p>
        <p>
          <strong>Development Phase: Project Secondus.</strong> We are currently architecting robust backend systems and database structures. 
          Upon completion of this phase, we will deliver our first fully-functional iteration of the trip planner. The roadmap then advances to <em>Project Cato</em>, where we will introduce our next suite of powerful features. 
        </p>
        <p><em>Mar 14, 2026: Project Primus (Core Infrastructure & Database Templating) successfully completed.</em></p>
      </section>

      <div className="status-box">
        <h3>Development Status: Restricted Access</h3>
        <p>
          Due to API integration costs and ongoing development, certain features are currently 
          locked to a limited number of testers. We appreciate your patience as we scale.
        </p>
        <p>
          In addtion, for security reasons all community driven things to include ride sharing will be turned off. 
          This is to prevent abuse of the system. As I am a individual developer I cannot 
          monitor the site 24/7 nor incure high costs of operation. 
        </p>
      </div>

      <div className="cta-area">
        <button className="std-button" onClick={() => navigate('/login')}>Begin your Journey</button>
      </div>
    </div>
  )
}

export default Home

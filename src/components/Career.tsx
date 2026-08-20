import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Education <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Development Intern</h4>
                <h5>BharatSkillz, Mumbai</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Assisted in web development using React and Node.js, completed
              mini projects, contributed to group project discussions, and
              participated in technical meetings.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Web Developer Intern</h4>
                <h5>BharatSkillz, Mumbai</h5>
              </div>
              <h3>Jun-Jul</h3>
            </div>
            <p>
              Developed web application features with React and Node.js,
              collaborated with developers, fixed bugs, and reviewed code to
              improve quality.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Bachelor of Information Technology</h4>
                <h5>St. Francis University of Technology</h5>
              </div>
              <h3>2024-28</h3>
            </div>
            <p>
              Studying Information Technology in Mumbai, India, with a focus on
              software development, web technologies, and practical project work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;

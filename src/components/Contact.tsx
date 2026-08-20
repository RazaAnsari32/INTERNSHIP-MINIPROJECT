import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a href="mailto:amrflegend32@gmail.com" data-cursor="disable">
                amrflegend32@gmail.com
              </a>
            </p>
            <h4>Education</h4>
            <p>
              Bachelor of Information Technology, St. Francis University of
              Technology, Mumbai - 2024-2028
            </p>
            <h4>Internship</h4>
            <p>
              Full Stack Web Developer Intern, BharatSkillz, Mumbai - June 2026
              to July 2026
            </p>
          </div>
          <div className="contact-box">
            <h4>Portfolio Sections</h4>
            <a href="#about" data-cursor="disable" className="contact-social">
              About <MdArrowOutward />
            </a>
            <a href="#work" data-cursor="disable" className="contact-social">
              Projects <MdArrowOutward />
            </a>
            <a href="#contact" data-cursor="disable" className="contact-social">
              Contact <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>R32</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

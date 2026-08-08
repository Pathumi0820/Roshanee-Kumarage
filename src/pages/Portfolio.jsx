import profileImage from '../assets/profile.jpeg';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  Code2,
  Database,
  GraduationCap,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageSquareQuote,
  Quote,
  Send,
  Sparkles,
  Star,
} from 'lucide-react';

import {
  SiDocker,
  SiExpress,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiJavascript,
  SiMedium,
  SiMongodb,
  SiNodedotjs,
  SiOpenjdk,
  SiPython,
  SiReact,
  SiTensorflow,
} from 'react-icons/si';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import Reveal from '../components/Reveal';
import { subscribeToContent } from '../store';
import { FiSettings } from "react-icons/fi";

const skillIconMap = {
  python: SiPython,
  java: SiOpenjdk,
  javascript: SiJavascript,
  react: SiReact,
  flutter: SiFlutter,
  'node.js': SiNodedotjs,
  nodejs: SiNodedotjs,
  firebase: SiFirebase,
  tensorflow: SiTensorflow,
  mongodb: SiMongodb,
  'express.js': SiExpress,
  express: SiExpress,
  git: SiGit,
  docker: SiDocker,
  'machine learning': BrainCircuit,
  database: Database,
};

function getSkillIcon(skill = '') {
  const normalizedSkill = skill.toLowerCase().trim();
  return skillIconMap[normalizedSkill] || Code2;
}

export default function Portfolio() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [contactStatus, setContactStatus] = useState({
    type: 'idle',
    message: '',
  });
  const lenisRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToContent(
      (updatedContent) => {
        setContent(updatedContent);
        setLoading(false);
        setLoadError('');
      },
      (error) => {
        console.error('Unable to load portfolio content:', error);
        setLoadError('Unable to load portfolio content.');
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const profile = content?.profile || {};
  const skills = content?.skills || [];
  const projects = content?.projects || [];
  const education = content?.education || [];
  const certifications = content?.certifications || [];
  const references = content?.references || [];
  const settings = content?.settings || {};

  const firstName =
    profile.name?.trim().split(' ')[0] || 'Portfolio';

  const accentColor = settings.accent || '#c7ff4a';
  const showEducation = settings.showEducation !== false;
  const showCertifications = settings.showCertifications !== false;

  const navigationItems = useMemo(
    () => [
      { id: 'home', label: 'Home', visible: true },
      { id: 'about', label: 'About', visible: true },
      {
        id: 'education',
        label: 'Education',
        visible: showEducation,
      },
      { id: 'skills', label: 'Skills', visible: true },
      { id: 'projects', label: 'Projects', visible: true },
      {
        id: 'certifications',
        label: 'Certifications',
        visible: showCertifications,
      },
      { id: 'references', label: 'References', visible: true },
      { id: 'contact', label: 'Contact', visible: true },
    ].filter((item) => item.visible),
    [showEducation, showCertifications],
  );

  useEffect(() => {
    const sections = navigationItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio - first.intersectionRatio,
          )[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-22% 0px -58% 0px',
        threshold: [0.08, 0.2, 0.4, 0.65],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navigationItems]);


  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion) return undefined;

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (loading || !content) return;

    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    const timer = window.setTimeout(() => {
      const top = getSectionTop(hash);

      if (top === null) {
        return;
      }

      if (lenisRef.current) {
        lenisRef.current.scrollTo(top, {
          immediate: true,
        });
      } else {
        window.scrollTo({
          top,
          behavior: 'auto',
        });
      }
    }, 120);

    return () => window.clearTimeout(timer);
  }, [loading, content]);

  const getSectionScrollTarget = (sectionId) =>
    document.getElementById(sectionId);

  const getSectionTop = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return null;
    }

    if (sectionId === 'home') {
      return 0;
    }

    return Math.max(
      0,
      section.getBoundingClientRect().top +
        window.scrollY,
    );
  };

  const handleSectionNavigation = (event, sectionId) => {
    event.preventDefault();

    const top = getSectionTop(sectionId);

    if (top === null) {
      return;
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(top, {
        duration: 1.05,
        easing: (time) => 1 - Math.pow(1 - time, 4),
      });
    } else {
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }

    setActiveSection(sectionId);
    window.history.replaceState(null, '', `#${sectionId}`);
  };

  if (loading) {
    return (
      <div className="portfolio-loader">
        <div className="loader-orbit" aria-hidden="true">
          <span className="loader-ring loader-ring-one" />
          <span className="loader-ring loader-ring-two" />
          <span className="loader-core">D.</span>
        </div>

        <div className="loader-copy">
          <p>PORTFOLIO</p>
          <h1>Preparing the experience</h1>
          <span>Loading projects, skills, and profile content.</span>
        </div>

        <div className="loader-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="portfolio-loading">
        <div>
          <p className="loading-kicker">ERROR</p>
          <h1>{loadError}</h1>
          <p>Please check your Firebase configuration and try again.</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formId = import.meta.env.VITE_FORMSPREE_FORM_ID;

    if (!formId) {
      setContactStatus({
        type: 'error',
        message:
          'Formspree is not configured. Add VITE_FORMSPREE_FORM_ID to the .env file and restart Vite.',
      });
      return;
    }

    const formData = new FormData(form);
    const senderName =
      formData.get('name')?.toString().trim() || 'Website visitor';

    formData.append(
      '_subject',
      `Portfolio message from ${senderName}`,
    );

    setContactStatus({
      type: 'submitting',
      message: 'Sending your message...',
    });

    try {
      const response = await fetch(
        `https://formspree.io/f/${formId}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          result?.errors
            ?.map((error) => error.message)
            .filter(Boolean)
            .join(' ') ||
          result?.message ||
          'The message could not be sent. Please try again.';

        throw new Error(message);
      }

      form.reset();

      setContactStatus({
        type: 'success',
        message:
          'Message sent successfully. Thank you for getting in touch!',
      });
    } catch (error) {
      console.error('Unable to send contact message:', error);

      setContactStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'The message could not be sent. Please try again.',
      });
    }
  };

  const navigationBar = (
    <header className="portfolio-fixed-nav">
      <a
        className="portfolio-fixed-brand"
        href="#home"
        onClick={(event) =>
          handleSectionNavigation(event, 'home')
        }
        aria-label="Go to home section"
      >
        {firstName}.
      </a>

      <nav
        className="portfolio-fixed-links"
        aria-label="Primary navigation"
      >
        {navigationItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={isActive ? 'active' : ''}
              aria-current={isActive ? 'page' : undefined}
              onClick={(event) =>
                handleSectionNavigation(event, item.id)
              }
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <span
        className="portfolio-fixed-balance"
        aria-hidden="true"
      />
    </header>
  );

  return (
    <>
      <style>{`
        .portfolio-fixed-nav {
          position: fixed;
          top: 16px;
          left: 7vw;
          right: 7vw;
          z-index: 2147483000;

          width: auto;
          max-width: none;
          height: 60px;
          margin: 0;
          padding: 0 22px;

          display: grid;
          grid-template-columns:
            minmax(160px, 1fr)
            auto
            minmax(160px, 1fr);
          align-items: center;

          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 999px;

          background: rgba(12, 12, 12, 0.92);
          backdrop-filter: blur(18px) saturate(130%);
          -webkit-backdrop-filter: blur(18px) saturate(130%);

          box-shadow:
            0 12px 35px rgba(0, 0, 0, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        .portfolio-fixed-brand {
          justify-self: start;
          color: #f4f1e8;
          font-family: Manrope, sans-serif;
          font-size: 20px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.03em;
          text-decoration: none;
        }

        .portfolio-fixed-brand:hover {
          color: var(--accent, #c7ff4a);
        }

        .portfolio-fixed-links {
          justify-self: center;
          display: flex;
          align-items: center;
          justify-content: center;

          width: max-content;
          height: 100%;
          gap: clamp(18px, 1.75vw, 30px);
        }

        .portfolio-fixed-links a {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 100%;

          color: #858585;
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          font-weight: 500;
          line-height: 1;
          white-space: nowrap;
          text-decoration: none;

          transition:
            color 0.25s ease,
            transform 0.25s ease;
        }

        .portfolio-fixed-links a:hover {
          color: #f4f1e8;
          transform: translateY(-1px);
        }

        .portfolio-fixed-links a::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 12px;

          width: 0;
          height: 2px;
          border-radius: 999px;
          background: var(--accent, #c7ff4a);

          opacity: 0;
          transform: translateX(-50%);

          transition:
            width 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.25s ease;
        }

        .portfolio-fixed-links a:hover::after {
          width: 14px;
          opacity: 0.65;
        }

        .portfolio-fixed-links a.active,
        .portfolio-fixed-links a[aria-current="page"] {
          color: #f4f1e8;
        }

        .portfolio-fixed-links a.active::after,
        .portfolio-fixed-links a[aria-current="page"]::after {
          width: 34px;
          opacity: 1;
        }

        .portfolio-fixed-balance {
          justify-self: stretch;
          min-width: 0;
        }

        @media (max-width: 1180px) {
          .portfolio-fixed-nav {
            left: 5vw;
            right: 5vw;
            padding: 0 20px;

            grid-template-columns:
              minmax(130px, 1fr)
              auto
              minmax(130px, 1fr);
          }

          .portfolio-fixed-links {
            gap: 16px;
          }

          .portfolio-fixed-links a {
            font-size: 12px;
          }
        }

        @media (max-width: 800px) {
          .portfolio-fixed-nav {
            top: 14px;
            left: 16px;
            right: 16px;
            height: 58px;
            padding: 0 20px;

            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .portfolio-fixed-brand {
            font-size: 19px;
          }

          .portfolio-fixed-links,
          .portfolio-fixed-balance {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .portfolio-fixed-nav {
            left: 14px;
            right: 14px;
            padding: 0 18px;
          }
        }


        .contact-form button:disabled {
          cursor: wait;
          opacity: 0.72;
          transform: none;
          filter: none;
        }

        .contact-form-status {
          margin: 2px 0 0;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
          text-align: center;
        }

        .contact-form-status-submitting {
          color: #d8d8d8;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .contact-form-status-success {
          color: var(--accent, #c7ff4a);
          background: color-mix(
            in srgb,
            var(--accent, #c7ff4a) 8%,
            transparent
          );
          border: 1px solid
            color-mix(
              in srgb,
              var(--accent, #c7ff4a) 25%,
              transparent
            );
        }

        .contact-form-status-error {
          color: #ffaaa3;
          background: rgba(255, 82, 82, 0.07);
          border: 1px solid rgba(255, 82, 82, 0.22);
        }

      `}</style>

      {typeof document !== 'undefined' &&
        createPortal(navigationBar, document.body)}

      <main style={{ '--accent': accentColor }}>
      <section id="home" className="hero section">
        <div className="hero-noise" />

        <div className="hero-wrapper">
          <Reveal className="hero-content">
            <p className="eyebrow">
              OPEN TO INTERNSHIP OPPORTUNITIES · 2026
            </p>

            <h1>{profile.name}</h1>

            <h2>{profile.role}</h2>

            <p className="hero-copy">
              {profile.intro}
            </p>

            <div className="hero-actions">
              <a
                className="primary-btn"
                href="#projects"
                onClick={(event) =>
                  handleSectionNavigation(event, 'projects')
                }
              >
                Explore work
                <ArrowDownRight size={18} />
              </a>

              {profile.cvUrl &&
                profile.cvUrl !== '#' && (
                  <a
                    className="text-btn"
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download CV
                  </a>
                )}
            </div>
          </Reveal>

          <Reveal className="hero-image">
            <img
              src={profileImage}
              alt={`${profile.name || 'Portfolio owner'} professional portrait`}
            />
          </Reveal>
        </div>

        <div className="scroll-label">
          SCROLL TO EXPLORE
        </div>
      </section>

      <section
        id="about"
        className="section section-grid"
      >
        <Reveal>
          <p className="section-kicker">
            01 / ABOUT
          </p>
        </Reveal>

        <Reveal className="section-main">
          <h3>
            I turn ideas into digital experiences
            through technology and software development.
          </h3>

          <p className="large-copy">
            {profile.about}
          </p>

          {profile.location && (
            <div className="meta-row">
              <MapPin size={18} />
              {profile.location}
            </div>
          )}
        </Reveal>
      </section>

      {showEducation && (
        <section
          id="education"
          className="section education-section"
        >
          <Reveal className="education-heading">
            <p className="section-kicker">
              02 / EDUCATION
            </p>

            <h3 className="section-title">
              Education and qualifications.
            </h3>

            <span
              className="education-heading-line"
              aria-hidden="true"
            />
          </Reveal>

          {education.length > 0 ? (
            <div className="education-timeline">
              <div
                className="education-center-line"
                aria-hidden="true"
              />

              {education.map((item, index) => {
                const isLeft = index % 2 === 0;
                const isCurrent =
                  index === education.length - 1;

                return (
                  <Reveal
                    key={`${item.title}-${index}`}
                    delay={index * 0.08}
                    className={`education-row ${
                      isLeft
                        ? 'education-row-left'
                        : 'education-row-right'
                    }`}
                  >
                    <article className="education-card">
                      <span
                        className="education-dot"
                        aria-hidden="true"
                      >
                        <span />
                      </span>

                      <div className="education-card-top">
                        <span className="education-period">
                          {item.period}
                        </span>

                        <span
                          className="education-icon"
                          aria-hidden="true"
                        >
                          <GraduationCap
                            size={18}
                            strokeWidth={2}
                          />
                        </span>
                      </div>

                      <h4>{item.title}</h4>

                      <div
                        className="education-divider"
                        aria-hidden="true"
                      />

                      <h5>{item.institution}</h5>

                      {item.description && (
                        <p className="education-description">
                          {item.description}
                        </p>
                      )}
                    </article>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <p className="empty-message">
              Education details will be added soon.
            </p>
          )}
        </section>
      )}

      <section id="skills" className="skills-section">
        <div className="skills-container">
          <Reveal className="skills-intro">
            <div className="skills-title-area">
              <p className="section-kicker">
                03 / SKILLS
              </p>

              <h3>
                Technologies behind
                <span> my work.</span>
              </h3>
            </div>

            <div className="skills-intro-copy">
              <Sparkles size={20} aria-hidden="true" />

              <p>
                A focused technical toolkit for data science,
                machine learning, cloud platforms, and intelligent
                application development.
              </p>
            </div>
          </Reveal>

          {skills.length > 0 ? (
            <div className="skills-bento-grid">
              {skills.map((skill, index) => {
                const SkillIcon = getSkillIcon(skill);
                const normalizedSkill = skill
                  .toLowerCase()
                  .trim();

                const featuredSkills = [
                  'python',
                  'tensorflow',
                  'pyspark',
                  'knowledge tracing (bkt/dkt)',
                ];

                const isFeatured =
                  featuredSkills.includes(normalizedSkill);

                const skillDescriptions = {
                  python:
                    'Data processing, automation, modelling, and machine learning.',
                  pyspark:
                    'Scalable data processing and distributed analytics.',
                  sql:
                    'Structured querying, transformation, and data management.',
                  tensorflow:
                    'Deep learning models and intelligent prediction systems.',
                  'scikit-learn':
                    'Classical machine learning and model evaluation.',
                  pandas:
                    'Data manipulation, cleaning, and exploratory analysis.',
                  numpy:
                    'Scientific computing and numerical operations.',
                  nlp:
                    'Language processing, text analytics, and feature extraction.',
                  'knowledge tracing (bkt/dkt)':
                    'Modelling how learners acquire knowledge over time.',
                  'google cloud platform':
                    'Cloud infrastructure, deployment, and data services.',
                  mongodb:
                    'Flexible document storage for modern applications.',
                };

                return (
                  <Reveal
                    key={`${skill}-${index}`}
                    delay={index * 0.04}
                    className={
                      isFeatured
                        ? 'skill-reveal skill-reveal-featured'
                        : 'skill-reveal'
                    }
                  >
                    <article
                      className={`skill-bento-card ${
                        isFeatured
                          ? 'skill-bento-featured'
                          : ''
                      }`}
                    >
                      <div
                        className="skill-bento-glow"
                        aria-hidden="true"
                      />

                      <div className="skill-bento-top">
                        <span className="skill-number">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="skill-status">
                          <span aria-hidden="true" />
                          Active
                        </span>
                      </div>

                      <div className="skill-bento-content">
                        <div className="skill-bento-icon">
                          <SkillIcon aria-hidden="true" />
                        </div>

                        <div>
                          <h4>{skill}</h4>

                          <p>
                            {skillDescriptions[
                              normalizedSkill
                            ] ||
                              'A core technology used across my projects and technical work.'}
                          </p>
                        </div>
                      </div>

                      <div className="skill-bento-footer">
                        <span>
                          {isFeatured
                            ? 'Core expertise'
                            : 'Technology'}
                        </span>

                        <span
                          className="skill-bento-arrow"
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <p className="empty-message">
              Skills will be added soon.
            </p>
          )}
        </div>
      </section>

      <section
        id="projects"
        className="section"
      >
        <Reveal>
          <p className="section-kicker">
            04 / SELECTED PROJECTS
          </p>

          <h3 className="section-title">
            Work that turns ideas into systems.
          </h3>
        </Reveal>

        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <Reveal
                key={
                  project.id ||
                  `${project.title}-${index}`
                }
                delay={index * 0.08}
              >
                <article className="project-card">
                  <div className="project-index">
                    {String(index + 1).padStart(
                      2,
                      '0',
                    )}
                  </div>

                  <div>
                    <p className="project-category">
                      {project.category}
                    </p>

                    <h4>{project.title}</h4>

                    <p>
                      {project.description}
                    </p>
                  </div>

                  {project.link &&
                    project.link !== '#' && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${project.title}`}
                        title={`Open ${project.title}`}
                      >
                        <ArrowUpRight />
                      </a>
                    )}
                </article>
              </Reveal>
            ))
          ) : (
            <p className="empty-message">
              Projects will be added soon.
            </p>
          )}
        </div>
      </section>

      {showCertifications && (
        <section
          id="certifications"
          className="section section-grid timeline-section"
        >
          <Reveal>
            <p className="section-kicker">
              05 / CERTIFICATIONS
            </p>
          </Reveal>

          <Reveal className="section-main">
            <h3 className="section-title">
              Courses and professional learning.
            </h3>

            {certifications.length > 0 ? (
              certifications.map(
                (item, index) => {
                  const hasValidLink =
                    item.link &&
                    item.link !== '#';

                  const contentElement = (
                    <>
                      <div>
                        <span>{item.year}</span>
                        <h5>{item.title}</h5>
                        <p>{item.issuer}</p>
                      </div>

                      {hasValidLink && (
                        <ArrowUpRight />
                      )}
                    </>
                  );

                  if (hasValidLink) {
                    return (
                      <a
                        className="certificate-item"
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        key={`${item.title}-${index}`}
                      >
                        {contentElement}
                      </a>
                    );
                  }

                  return (
                    <div
                      className="certificate-item"
                      key={`${item.title}-${index}`}
                    >
                      {contentElement}
                    </div>
                  );
                },
              )
            ) : (
              <p className="empty-message">
                Certifications will be added
                soon.
              </p>
            )}
          </Reveal>
        </section>
      )}

      <section
        id="references"
        className="section references-section"
      >
        <Reveal className="references-heading">
          <p className="section-kicker">
            06 / REFERENCES
          </p>

          <div className="references-heading-row">
            <div>
              <h3 className="section-title">
                Recommendations &amp; testimonials.
              </h3>

              <p className="references-intro">
                Professional references from lecturers,
                supervisors, mentors, and collaborators.
              </p>
            </div>

            <span
              className="references-heading-icon"
              aria-hidden="true"
            >
              <Quote size={22} />
            </span>
          </div>
        </Reveal>

        {references.length > 0 ? (
          <div className="references-grid">
            {references.map((reference, index) => {
              const rating = Math.min(
                5,
                Math.max(0, Number(reference.rating) || 5),
              );

              return (
                <Reveal
                  key={
                    reference.id ||
                    `${reference.name || 'reference'}-${index}`
                  }
                  delay={index * 0.08}
                >
                  <article className="reference-card">
                    <div className="reference-card-top">
                      <div
                        className="reference-rating"
                        aria-label={`${rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map(
                          (_, starIndex) => (
                            <Star
                              key={starIndex}
                              size={15}
                              aria-hidden="true"
                              fill={
                                starIndex < rating
                                  ? 'currentColor'
                                  : 'none'
                              }
                            />
                          ),
                        )}
                      </div>

                      {reference.relationship && (
                        <span className="reference-relationship">
                          {reference.relationship}
                        </span>
                      )}
                    </div>

                    <blockquote>
                      “{reference.text}”
                    </blockquote>

                    <div className="reference-author">
                      <div className="reference-avatar-wrap">
                        {reference.image ? (
                          <img
                            src={reference.image}
                            alt={`${reference.name || 'Reference'} profile`}
                            className="reference-avatar-image"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none';

                              const fallback =
                                event.currentTarget.nextElementSibling;

                              if (fallback) {
                                fallback.style.display = 'grid';
                              }
                            }}
                          />
                        ) : null}

                        <span
                          className="reference-avatar reference-avatar-fallback"
                          aria-hidden="true"
                          style={{
                            display: reference.image ? 'none' : 'grid',
                          }}
                        >
                          {(reference.name || 'R')
                            .trim()
                            .split(' ')
                            .map((part) => part.charAt(0))
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <h4>
                          {reference.name || 'Reference'}
                        </h4>

                        <p>
                          {[reference.role, reference.company]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <Reveal className="references-empty-card">
            <span
              className="references-empty-icon"
              aria-hidden="true"
            >
              <MessageSquareQuote size={28} />
            </span>

            <p className="references-empty-label">
              REFERENCES
            </p>

            <h4>No recommendations yet.</h4>

            <p className="references-empty-copy">
              Genuine recommendations from lecturers,
              supervisors, internship mentors, and
              collaborators will appear here as my
              professional journey grows.
            </p>

            <span className="references-coming-soon">
              Coming soon
            </span>
          </Reveal>
        )}
      </section>

      <section
        id="contact"
        className="section contact-section"
      >
        <Reveal className="contact-heading">
          <p className="contact-kicker">
            LET&apos;S CONNECT
          </p>

          <h3>Contact Me</h3>

          <p>
            Have a project in mind or just want to
            say hi? Send a message.
          </p>

          <span className="contact-underline" />
        </Reveal>

        <Reveal className="contact-card">
          <form
            className="contact-form"
            onSubmit={handleContactSubmit}
          >
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              aria-label="Your name"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Your Email"
              aria-label="Your email"
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              aria-label="Your message"
              required
            />

            <button
              type="submit"
              disabled={contactStatus.type === 'submitting'}
            >
              <Send size={18} />
              {contactStatus.type === 'submitting'
                ? 'Sending...'
                : 'Send Message'}
            </button>

            {contactStatus.message && (
              <p
                className={`contact-form-status contact-form-status-${contactStatus.type}`}
                role={
                  contactStatus.type === 'error'
                    ? 'alert'
                    : 'status'
                }
                aria-live="polite"
              >
                {contactStatus.message}
              </p>
            )}
          </form>
        </Reveal>

        <div className="contact-details">
          {profile.email && (
            <a
              className="contact-email-row"
              href={`mailto:${profile.email}`}
            >
              <Mail size={18} />
              {profile.email}
            </a>
          )}

          <div className="contact-socials">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <Github />
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin />
              </a>
            )}

            {profile.dagshub && (
              <a
                href={profile.dagshub}
                target="_blank"
                rel="noreferrer"
                aria-label="DagsHub"
                title="DagsHub"
              >
                <Database />
              </a>
            )}

            {profile.medium && (
              <a
                href={profile.medium}
                target="_blank"
                rel="noreferrer"
                aria-label="Medium"
                title="Medium"
              >
                <SiMedium />
              </a>
            )}
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>
          © 2026 {profile.name}. Designed and built with care.
        </p>

        <a
          href="/admin"
          className="footer-admin-icon"
          aria-label="Admin Dashboard"
          title="Admin Dashboard"
        >
          <FiSettings />
        </a>
      </footer>
      </main>
    </>
  );
}
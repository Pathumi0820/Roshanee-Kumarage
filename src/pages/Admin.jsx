import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Eye,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';

import {
  login,
  logout,
  resetContent,
  saveContent,
  subscribeToAuthentication,
  subscribeToContent,
} from '../store';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    setError('');
    setSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (loginError) {
        console.error(
          'Firebase login error:',
          loginError.code,
          loginError.message,
        );

        setError(
          `${loginError.code}: ${loginError.message}`,
        );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={submit} className="login-card">
        <div className="admin-badge">PORTFOLIO CMS</div>

        <h1>Welcome back.</h1>

        <p>Sign in to update your portfolio content.</p>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({
                ...form,
                email: event.target.value,
              })
            }
            autoComplete="email"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({
                ...form,
                password: event.target.value,
              })
            }
            autoComplete="current-password"
            required
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value = '',
  onChange,
  textarea = false,
  type = 'text',
  placeholder = '',
}) {
  return (
    <label className="field">
      <span>{label}</span>

      {textarea ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function AdminLoader({
  title = 'Loading Dashboard',
  message = 'Preparing your portfolio editor...',
}) {
  return (
    <div className="admin-loader">
      <div className="admin-loader-content">
        <span className="loader-tag">ADMIN DASHBOARD</span>

        <div
          className="loader-spinner"
          aria-hidden="true"
        />

        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToContent(
      (updatedContent) => {
        setContent(updatedContent);
        setLoading(false);
        setError('');
      },
      (subscriptionError) => {
        console.error(
          'Unable to load portfolio data:',
          subscriptionError,
        );

        setError('Unable to load portfolio data.');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const patchProfile = (key, value) => {
    setContent((currentContent) => ({
      ...currentContent,
      profile: {
        ...currentContent.profile,
        [key]: value,
      },
    }));
  };

  const save = async () => {
    if (!content || saving) {
      return;
    }

    setError('');
    setSaving(true);

    try {
      await saveContent(content);
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 1800);
    } catch (saveError) {
      console.error('Unable to save portfolio content:', saveError);
      setError('Could not save your changes.');
    } finally {
      setSaving(false);
    }
  };

  const addProject = () => {
    setContent((currentContent) => ({
      ...currentContent,
      projects: [
        ...(currentContent.projects || []),
        {
          id: crypto.randomUUID(),
          title: 'New Project',
          category: 'Technology',
          description: 'Add your project description.',
          link: '#',
        },
      ],
    }));
  };

  const updateProject = (index, key, value) => {
    setContent((currentContent) => {
      const projectList = [...(currentContent.projects || [])];

      projectList[index] = {
        ...projectList[index],
        [key]: value,
      };

      return {
        ...currentContent,
        projects: projectList,
      };
    });
  };

  const removeProject = (index) => {
    setContent((currentContent) => ({
      ...currentContent,
      projects: (currentContent.projects || []).filter(
        (_, projectIndex) => projectIndex !== index,
      ),
    }));
  };

  const addEducation = () => {
    setContent((currentContent) => ({
      ...currentContent,
      education: [
        ...(currentContent.education || []),
        {
          title: 'New qualification',
          institution: 'Institution',
          period: 'Year',
          description: 'Add a short description of this qualification.',
        },
      ],
    }));
  };

  const updateEducation = (index, key, value) => {
    setContent((currentContent) => {
      const educationList = [...(currentContent.education || [])];

      educationList[index] = {
        ...educationList[index],
        [key]: value,
      };

      return {
        ...currentContent,
        education: educationList,
      };
    });
  };

  const removeEducation = (index) => {
    setContent((currentContent) => ({
      ...currentContent,
      education: (currentContent.education || []).filter(
        (_, educationIndex) => educationIndex !== index,
      ),
    }));
  };

  const addCertification = () => {
    setContent((currentContent) => ({
      ...currentContent,
      certifications: [
        ...(currentContent.certifications || []),
        {
          title: 'New certification',
          issuer: 'Issuing organization',
          year: '2026',
          link: '#',
        },
      ],
    }));
  };

  const updateCertification = (index, key, value) => {
    setContent((currentContent) => {
      const certificationList = [
        ...(currentContent.certifications || []),
      ];

      certificationList[index] = {
        ...certificationList[index],
        [key]: value,
      };

      return {
        ...currentContent,
        certifications: certificationList,
      };
    });
  };

  const removeCertification = (index) => {
    setContent((currentContent) => ({
      ...currentContent,
      certifications: (currentContent.certifications || []).filter(
        (_, certificationIndex) => certificationIndex !== index,
      ),
    }));
  };

  const addReference = () => {
    setContent((currentContent) => ({
      ...currentContent,
      references: [
        ...(currentContent.references || []),
        {
          id: crypto.randomUUID(),
          name: 'Reference name',
          role: 'Role or position',
          company: 'Organization',
          relationship: 'Lecturer',
          rating: 5,
          image: '',
          text: 'Add the recommendation or testimonial here.',
        },
      ],
    }));
  };

  const updateReference = (index, key, value) => {
    setContent((currentContent) => {
      const referenceList = [...(currentContent.references || [])];

      referenceList[index] = {
        ...referenceList[index],
        [key]: key === 'rating' ? Number(value) : value,
      };

      return {
        ...currentContent,
        references: referenceList,
      };
    });
  };

  const removeReference = (index) => {
    setContent((currentContent) => ({
      ...currentContent,
      references: (currentContent.references || []).filter(
        (_, referenceIndex) => referenceIndex !== index,
      ),
    }));
  };

  const resetDemoContent = async () => {
    setError('');

    const confirmed = window.confirm(
      'Reset all portfolio content to the default values?',
    );

    if (!confirmed) {
      return;
    }

    try {
      await resetContent();
      setSaved(false);
    } catch (resetError) {
      console.error('Unable to reset portfolio content:', resetError);
      setError('Could not reset the portfolio content.');
    }
  };

  const signOut = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (logoutError) {
      console.error('Unable to sign out:', logoutError);
      setError('Could not sign out. Please try again.');
    }
  };

  if (loading) {
    return (
      <AdminLoader
        title="Loading Dashboard"
        message="Preparing your portfolio editor..."
      />
    );
  }

  if (!content) {
    return (
      <div className="portfolio-loading">
        <div>
          <p className="loading-kicker">ERROR</p>
          <h1>
            {error || 'Portfolio content could not be loaded.'}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside>
        <div>
          <div className="admin-logo">D.</div>

          <p>
            Portfolio
            <br />
            Control Center
          </p>
        </div>

        <nav>
          <a href="#profile">Profile</a>
          <a href="#education-admin">Education</a>
          <a href="#skills">Skills</a>
          <a href="#projects-admin">Projects</a>
          <a href="#certifications-admin">Certifications</a>
          <a href="#references-admin">References</a>
          <a href="#settings">Settings</a>
        </nav>

        <button
          className="logout"
          type="button"
          onClick={signOut}
        >
          <LogOut size={17} />
          Logout
        </button>
      </aside>

      <div className="admin-content">
        <header>
          <div>
            <p className="admin-kicker">ADMIN DASHBOARD</p>
            <h1>Manage your portfolio</h1>
          </div>

          <div className="header-actions">
            <a href="/" target="_blank" rel="noreferrer">
              <Eye size={17} />
              Preview
            </a>

            <button
              type="button"
              onClick={save}
              disabled={saving}
            >
              <Save size={17} />

              {saving
                ? 'Saving...'
                : saved
                  ? 'Saved!'
                  : 'Save changes'}
            </button>
          </div>
        </header>

        {error && <div className="error">{error}</div>}

        <section id="profile" className="admin-panel">
          <div className="panel-heading">
            <div>
              <span>01</span>
              <h2>Profile information</h2>
            </div>

            <p>
              Main content shown in the hero, about, and contact
              sections.
            </p>
          </div>

          <div className="form-grid">
            <Field
              label="Full name"
              value={content.profile?.name}
              onChange={(value) => patchProfile('name', value)}
            />

            <Field
              label="Professional role"
              value={content.profile?.role}
              onChange={(value) => patchProfile('role', value)}
            />

            <Field
              label="Hero introduction"
              value={content.profile?.intro}
              onChange={(value) => patchProfile('intro', value)}
              textarea
            />

            <Field
              label="About description"
              value={content.profile?.about}
              onChange={(value) => patchProfile('about', value)}
              textarea
            />

            <Field
              label="Location"
              value={content.profile?.location}
              onChange={(value) => patchProfile('location', value)}
            />

            <Field
              label="Email"
              type="email"
              value={content.profile?.email}
              onChange={(value) => patchProfile('email', value)}
            />

            <Field
              label="GitHub URL"
              type="url"
              value={content.profile?.github}
              placeholder="https://github.com/username"
              onChange={(value) => patchProfile('github', value)}
            />

            <Field
              label="LinkedIn URL"
              type="url"
              value={content.profile?.linkedin}
              placeholder="https://www.linkedin.com/in/username"
              onChange={(value) => patchProfile('linkedin', value)}
            />

            <Field
              label="DagsHub URL"
              type="url"
              value={content.profile?.dagshub || ''}
              placeholder="https://dagshub.com/username"
              onChange={(value) => patchProfile('dagshub', value)}
            />

            <Field
              label="Medium URL"
              type="url"
              value={content.profile?.medium || ''}
              placeholder="https://medium.com/@username"
              onChange={(value) => patchProfile('medium', value)}
            />

            <Field
              label="CV URL"
              type="url"
              value={content.profile?.cvUrl || ''}
              placeholder="https://example.com/my-cv.pdf"
              onChange={(value) => patchProfile('cvUrl', value)}
            />
          </div>
        </section>

        <section id="education-admin" className="admin-panel">
          <div className="panel-heading">
            <div>
              <span>02</span>
              <h2>Education</h2>
            </div>

            <button
              className="secondary"
              type="button"
              onClick={addEducation}
            >
              <Plus size={16} />
              Add education
            </button>
          </div>

          <div className="project-editor-list">
            {(content.education || []).map((item, index) => (
              <div
                className="project-editor"
                key={`education-${index}`}
              >
                <div className="project-editor-top">
                  <strong>
                    Education {String(index + 1).padStart(2, '0')}
                  </strong>

                  <button
                    className="icon-danger"
                    type="button"
                    aria-label={`Delete education ${index + 1}`}
                    onClick={() => removeEducation(index)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="form-grid">
                  <Field
                    label="Qualification"
                    value={item.title}
                    onChange={(value) =>
                      updateEducation(index, 'title', value)
                    }
                  />

                  <Field
                    label="Institution"
                    value={item.institution}
                    onChange={(value) =>
                      updateEducation(index, 'institution', value)
                    }
                  />

                  <Field
                    label="Period"
                    value={item.period}
                    placeholder="2023 — Present"
                    onChange={(value) =>
                      updateEducation(index, 'period', value)
                    }
                  />

                  <Field
                    label="Description"
                    value={item.description || ''}
                    placeholder="Specializing in AI, Data Science, and Intelligent Systems."
                    onChange={(value) =>
                      updateEducation(index, 'description', value)
                    }
                    textarea
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="admin-panel">
          <div className="panel-heading">
            <div>
              <span>03</span>
              <h2>Skills</h2>
            </div>

            <p>Separate skills using commas.</p>
          </div>

          <Field
            label="Skills"
            value={(content.skills || []).join(', ')}
            onChange={(value) =>
              setContent((currentContent) => ({
                ...currentContent,
                skills: value
                  .split(',')
                  .map((skill) => skill.trim())
                  .filter(Boolean),
              }))
            }
            textarea
          />
        </section>

        <section id="projects-admin" className="admin-panel">
          <div className="panel-heading">
            <div>
              <span>04</span>
              <h2>Projects</h2>
            </div>

            <button
              className="secondary"
              type="button"
              onClick={addProject}
            >
              <Plus size={16} />
              Add project
            </button>
          </div>

          <div className="project-editor-list">
            {(content.projects || []).map((project, index) => (
              <div
                className="project-editor"
                key={project.id || `project-${index}`}
              >
                <div className="project-editor-top">
                  <strong>
                    Project {String(index + 1).padStart(2, '0')}
                  </strong>

                  <button
                    className="icon-danger"
                    type="button"
                    aria-label={`Delete project ${index + 1}`}
                    onClick={() => removeProject(index)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="form-grid">
                  <Field
                    label="Title"
                    value={project.title}
                    onChange={(value) =>
                      updateProject(index, 'title', value)
                    }
                  />

                  <Field
                    label="Technology / category"
                    value={project.category}
                    onChange={(value) =>
                      updateProject(index, 'category', value)
                    }
                  />

                  <Field
                    label="Description"
                    value={project.description}
                    onChange={(value) =>
                      updateProject(index, 'description', value)
                    }
                    textarea
                  />

                  <Field
                    label="Project URL"
                    type="url"
                    value={project.link}
                    onChange={(value) =>
                      updateProject(index, 'link', value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="certifications-admin"
          className="admin-panel"
        >
          <div className="panel-heading">
            <div>
              <span>05</span>
              <h2>Certifications</h2>
            </div>

            <button
              className="secondary"
              type="button"
              onClick={addCertification}
            >
              <Plus size={16} />
              Add certification
            </button>
          </div>

          <div className="project-editor-list">
            {(content.certifications || []).map((item, index) => (
              <div
                className="project-editor"
                key={`certification-${index}`}
              >
                <div className="project-editor-top">
                  <strong>
                    Certification{' '}
                    {String(index + 1).padStart(2, '0')}
                  </strong>

                  <button
                    className="icon-danger"
                    type="button"
                    aria-label={`Delete certification ${index + 1}`}
                    onClick={() => removeCertification(index)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="form-grid">
                  <Field
                    label="Title"
                    value={item.title}
                    onChange={(value) =>
                      updateCertification(index, 'title', value)
                    }
                  />

                  <Field
                    label="Issuer"
                    value={item.issuer}
                    onChange={(value) =>
                      updateCertification(index, 'issuer', value)
                    }
                  />

                  <Field
                    label="Year"
                    value={item.year}
                    onChange={(value) =>
                      updateCertification(index, 'year', value)
                    }
                  />

                  <Field
                    label="Credential URL"
                    type="url"
                    value={item.link}
                    onChange={(value) =>
                      updateCertification(index, 'link', value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="references-admin"
          className="admin-panel"
        >
          <div className="panel-heading">
            <div>
              <span>06</span>
              <h2>References</h2>
            </div>

            <button
              className="secondary"
              type="button"
              onClick={addReference}
            >
              <Plus size={16} />
              Add reference
            </button>
          </div>

          {(content.references || []).length === 0 ? (
            <div className="admin-empty-state">
              <strong>No references added yet.</strong>
              <p>
                This section will remain empty on the public
                portfolio until you add a genuine recommendation.
              </p>
            </div>
          ) : (
            <div className="project-editor-list">
              {(content.references || []).map(
                (reference, index) => (
                  <div
                    className="project-editor"
                    key={
                      reference.id ||
                      `reference-${index}`
                    }
                  >
                    <div className="project-editor-top">
                      <strong>
                        Reference{' '}
                        {String(index + 1).padStart(2, '0')}
                      </strong>

                      <button
                        className="icon-danger"
                        type="button"
                        aria-label={`Delete reference ${index + 1}`}
                        onClick={() => removeReference(index)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="form-grid">
                      <Field
                        label="Full name"
                        value={reference.name || ''}
                        placeholder="Dr. Jane Smith"
                        onChange={(value) =>
                          updateReference(index, 'name', value)
                        }
                      />

                      <Field
                        label="Role / position"
                        value={reference.role || ''}
                        placeholder="Senior Lecturer"
                        onChange={(value) =>
                          updateReference(index, 'role', value)
                        }
                      />

                      <Field
                        label="Organization"
                        value={reference.company || ''}
                        placeholder="Sri Lanka Technological Campus"
                        onChange={(value) =>
                          updateReference(index, 'company', value)
                        }
                      />

                      <Field
                        label="Relationship"
                        value={reference.relationship || ''}
                        placeholder="Lecturer / Supervisor / Mentor"
                        onChange={(value) =>
                          updateReference(
                            index,
                            'relationship',
                            value,
                          )
                        }
                      />

                      <Field
                        label="Rating"
                        type="number"
                        value={reference.rating ?? 5}
                        placeholder="5"
                        onChange={(value) =>
                          updateReference(index, 'rating', value)
                        }
                      />

                      <Field
                        label="Profile image URL"
                        type="url"
                        value={reference.image || ''}
                        placeholder="https://example.com/profile.jpg"
                        onChange={(value) =>
                          updateReference(index, 'image', value)
                        }
                      />

                      <Field
                        label="Recommendation"
                        value={reference.text || ''}
                        placeholder="Write the recommendation or testimonial."
                        onChange={(value) =>
                          updateReference(index, 'text', value)
                        }
                        textarea
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>

        <section id="settings" className="admin-panel">
          <div className="panel-heading">
            <div>
              <span>07</span>
              <h2>Display settings</h2>
            </div>
          </div>

          <div className="settings-row">
            <label>
              Accent color
              <input
                type="color"
                value={content.settings?.accent || '#c7ff4a'}
                onChange={(event) =>
                  setContent((currentContent) => ({
                    ...currentContent,
                    settings: {
                      ...currentContent.settings,
                      accent: event.target.value,
                    },
                  }))
                }
              />
            </label>

            <label>
              <input
                type="checkbox"
                checked={
                  content.settings?.showEducation ?? true
                }
                onChange={(event) =>
                  setContent((currentContent) => ({
                    ...currentContent,
                    settings: {
                      ...currentContent.settings,
                      showEducation: event.target.checked,
                    },
                  }))
                }
              />
              Show education
            </label>

            <label>
              <input
                type="checkbox"
                checked={
                  content.settings?.showCertifications ?? true
                }
                onChange={(event) =>
                  setContent((currentContent) => ({
                    ...currentContent,
                    settings: {
                      ...currentContent.settings,
                      showCertifications: event.target.checked,
                    },
                  }))
                }
              />
              Show certifications
            </label>
          </div>

          <button
            className="reset"
            type="button"
            onClick={resetDemoContent}
          >
            <RotateCcw size={16} />
            Reset demo content
          </button>
        </section>
      </div>
    </div>
  );
}

function ProtectedAdmin() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = subscribeToAuthentication(
      (authenticatedUser) => {
        setUser(authenticatedUser);
      },
    );

    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <AdminLoader
        title="Checking Access"
        message="Verifying your administrator session..."
      />
    );
  }

  return user ? (
    <Dashboard />
  ) : (
    <Navigate to="/admin/login" replace />
  );
}

export default ProtectedAdmin;
export { Login };
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../../services/api";
import { todayISO } from "../../utils/helpers";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ApplicationForm({ job }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resumeUrl: "",
    coverLetter: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone is required.";
    }

    if (!form.resumeUrl.trim()) {
      nextErrors.resumeUrl = "Resume URL is required.";
    } else {
      try {
        new URL(form.resumeUrl.trim());
      } catch {
        nextErrors.resumeUrl = "Enter a valid URL.";
      }
    }

    if (!form.coverLetter.trim()) {
      nextErrors.coverLetter = "Cover letter is required.";
    } else if (form.coverLetter.trim().length < 30) {
      nextErrors.coverLetter = "Cover letter must be at least 30 characters.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await createApplication({
        ...form,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        appliedAt: todayISO(),
        status: "submitted",
      });
      navigate("/apply/success");
    } catch (err) {
      setError(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Apply for {job.title}</h2>
      {error ? <p className="error-text">{error}</p> : null}

      <label htmlFor="name">Full Name</label>
      <input id="name" name="name" value={form.name} onChange={handleChange} aria-invalid={Boolean(fieldErrors.name)} />
      {fieldErrors.name ? <p className="error-text">{fieldErrors.name}</p> : null}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        aria-invalid={Boolean(fieldErrors.email)}
      />
      {fieldErrors.email ? <p className="error-text">{fieldErrors.email}</p> : null}

      <label htmlFor="phone">Phone</label>
      <input id="phone" name="phone" value={form.phone} onChange={handleChange} aria-invalid={Boolean(fieldErrors.phone)} />
      {fieldErrors.phone ? <p className="error-text">{fieldErrors.phone}</p> : null}

      <label htmlFor="resumeUrl">Resume URL</label>
      <input
        id="resumeUrl"
        name="resumeUrl"
        value={form.resumeUrl}
        onChange={handleChange}
        aria-invalid={Boolean(fieldErrors.resumeUrl)}
      />
      {fieldErrors.resumeUrl ? <p className="error-text">{fieldErrors.resumeUrl}</p> : null}

      <label htmlFor="coverLetter">Cover Letter</label>
      <textarea
        id="coverLetter"
        name="coverLetter"
        rows="4"
        value={form.coverLetter}
        onChange={handleChange}
        aria-invalid={Boolean(fieldErrors.coverLetter)}
      />
      {fieldErrors.coverLetter ? <p className="error-text">{fieldErrors.coverLetter}</p> : null}

      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

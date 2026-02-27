import { useEffect, useMemo, useState } from "react";
import { JOB_TYPES, LOCATIONS } from "../../utils/constants";

const emptyForm = {
  title: "",
  company: "",
  location: "Remote",
  type: "Full-time",
  salaryMin: "",
  salaryMax: "",
  description: "",
};

export default function JobForm({ initialData, onSubmit, onCancel, submitLabel }) {
  const startingData = useMemo(() => initialData || emptyForm, [initialData]);
  const [form, setForm] = useState(startingData);

  useEffect(() => {
    setForm(startingData);
  }, [startingData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      salaryMin: Number(form.salaryMin) || null,
      salaryMax: Number(form.salaryMax) || null,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="title">Job Title</label>
      <input id="title" name="title" value={form.title} onChange={handleChange} required />

      <label htmlFor="company">Company</label>
      <input id="company" name="company" value={form.company} onChange={handleChange} required />

      <label htmlFor="location">Location</label>
      <input
        id="location"
        name="location"
        list="location-options"
        value={form.location}
        onChange={handleChange}
        placeholder="Type location or pick from list"
        required
      />
      <datalist id="location-options">
        {LOCATIONS.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>

      <label htmlFor="type">Job Type</label>
      <select id="type" name="type" value={form.type} onChange={handleChange}>
        {JOB_TYPES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <label htmlFor="salaryMin">Minimum Salary</label>
      <input id="salaryMin" name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} />

      <label htmlFor="salaryMax">Maximum Salary</label>
      <input id="salaryMax" name="salaryMax" type="number" value={form.salaryMax} onChange={handleChange} />

      <label htmlFor="description">Description</label>
      <textarea id="description" name="description" rows="4" value={form.description} onChange={handleChange} required />

      <div className="filter-row">
        <button type="submit">{submitLabel}</button>
        {onCancel ? (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

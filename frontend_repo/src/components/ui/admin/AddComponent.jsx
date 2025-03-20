import React, { useState } from "react";

const FormField = ({
  label,
  id,
  type,
  value,
  onChange,
  required = true,
  className = "",
}) => {
  const InputComponent = type === "textarea" ? "textarea" : "input";

  return (
    <div className="mb-4 flex items-center">
      <label htmlFor={id} className="w-1/3 text-sm font-medium text-gray-700">
        {label}
      </label>
      <InputComponent
        type={type !== "textarea" ? type : undefined}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`mt-1 p-2 w-2/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      />
    </div>
  );
};

const GenericForm = ({
  title,
  fields,
  values,
  setValues,
  onSubmit,
  submitButtonText = "제출하기",
  submitButtonClass = "",
}) => {
  const handleChange = (fieldName) => (e) => {
    setValues((prev) => ({ ...prev, [fieldName]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <FormField
            key={field.id}
            label={field.label}
            id={field.id}
            type={field.type}
            value={values[field.id]}
            onChange={handleChange(field.id)}
            required={field.required !== false}
            className={field.className}
          />
        ))}

        <button
          type="submit"
          className={`w-3/5 py-3 mt-6 bg-[#ebe2d5] font-semibold mx-auto block ${submitButtonClass}`}
        >
          {submitButtonText}
        </button>
      </form>
    </div>
  );
};

export default GenericForm;

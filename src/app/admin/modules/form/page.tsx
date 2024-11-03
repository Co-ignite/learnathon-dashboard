"use client";

import ModuleConfirmationForm from "@components/college/moduleConfirmationForm";

export default function Form() {
  return (
    <section id="admin" className="bg-white">
      <ModuleConfirmationForm
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </section>
  );
}

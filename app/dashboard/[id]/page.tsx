"use client";

const selectedJournal = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1>Selected Journal: {params.id}</h1>
      <h1>Journal</h1>
    </div>
  );
};

export default selectedJournal;

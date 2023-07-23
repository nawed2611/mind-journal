"use client";

const selectedJournal = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1>Selected Journal: {params.id}</h1>
      <p>Journal</p>
    </div>
  );
};

export default selectedJournal;

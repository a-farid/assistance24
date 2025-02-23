import AddMilitaryForm from "./_components/AddMilitaryForm";

type Props = {};

const page = (props: Props) => {
  return (
    <>
      <h2 className="border-b pb-2 w-full text-center">
        Ajouter un nouveau militaire
      </h2>
      <AddMilitaryForm />
    </>
  );
};

export default page;

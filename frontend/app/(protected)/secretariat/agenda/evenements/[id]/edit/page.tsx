import EditEvenntForm from "./_components/EventForm";

type Props = {
  params: {
    id: number;
  };
};
const EditEvent = ({ params }: Props) => {
  return (
    <div>
      <h2>Modifier un evenement</h2>
      <EditEvenntForm id={params.id} />
    </div>
  );
};

export default EditEvent;

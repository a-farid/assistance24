export interface IEvent {
  id: string;
  userConcerners: { nom_officier: string }[];
  uuid: string;
  created_at: string;
  updated_at: string;
  sceOrigine: string;
  refEcrit: string;
  evenement: string;
  lieuEvent: string;
  dateDebut: string;
  dateFin: string;
  timeStart: string;
  intervalleTime: string;
  typeEvent: string;
}

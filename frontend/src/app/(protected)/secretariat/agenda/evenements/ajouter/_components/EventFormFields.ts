export const EventFormFields = {
  submitBtn: "Ajouter",
  data: [
    {
      label: "Section d'origine",
      name: "sceOrigine",
      type: "text",
    },
    {
      label: "Reference d'ecrit",
      name: "refEcrit",
      type: "number",
      autocomplete: "off",
    },
    {
      label: "Evenement",
      name: "evenement",
      type: "text",
    },
    {
      label: "Lieu",
      name: "lieuEvent",
      type: "text",
    },
    {
      label: "Date debut",
      name: "dateDebut",
      type: "date",
      autocomplete: "off",
    },
    {
      label: "Date fin",
      name: "dateFin",
      type: "date",
      autocomplete: "off",
    },
    {
      label: "Heure de debut",
      name: "timeStart",
      type: "time",
      autocomplete: "off",
    },
    {
      label: "Intervalle de temps",
      name: "intervalleTime",
      type: "text",
      autocomplete: "",
    },
    {
      label: "Type",
      name: "typeEvent",
      type: "select",
      autocomplete: "off",
      options: [
        { value: "presentiel", label: "Presentiel" },
        { value: "online", label: "Online" },
      ],
    },
    {
      label: "Officiers concerner",
      name: "officierConcerners",
      type: "text",
      autocomplete: "off",
    },
  ],
};

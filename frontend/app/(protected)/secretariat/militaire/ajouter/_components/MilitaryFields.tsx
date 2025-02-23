"use client";
import { FormikField } from "@/utils/interface/FormikField";
import { FormikProps } from "formik";
import { CircleX, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import UnitesAffectationField from "./UnitesAffectationField";

const DiplomesFields = (formik: FormikProps<any>, fieldName: string) => {
  const [diplome, setDiplome] = useState<{ titre: string; date: string }>({
    titre: "",
    date: "",
  });

  const addDiplome = () => {
    const { titre, date } = diplome;
    if (titre && date) {
      formik.setFieldValue(fieldName, [
        ...formik.values[fieldName],
        { titre, date },
      ]);
      setDiplome({ titre: "", date: "" });
    }
  };

  const removeDiplome = (index: number) => {
    const updatedDiplomes = formik.values[fieldName].filter(
      (_: any, idx: number) => idx !== index
    );
    formik.setFieldValue(fieldName, updatedDiplomes);
  };

  useEffect(() => {
    const isFirstDiplomeEmpty =
      formik.values[fieldName].length === 2 &&
      !formik.values[fieldName][0]?.titre;
    if (isFirstDiplomeEmpty) {
      removeDiplome(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values[fieldName]]);
  console.log("formik.values[fieldName]", formik.values[fieldName]);
  return (
    <div className="col-span-2">
      <div className="w-full mb-2 relative flex items-center justify-between">
        <div className="flex gap-2 w-full">
          <input
            className="p-1"
            type="text"
            placeholder="Titre"
            value={diplome.titre}
            onChange={(e) => setDiplome({ ...diplome, titre: e.target.value })}
          />
          <input
            className="p-1"
            type="date"
            placeholder="Date"
            value={diplome.date}
            onChange={(e) => setDiplome({ ...diplome, date: e.target.value })}
          />
        </div>
        <button type="button" className="p-2 text-white" onClick={addDiplome}>
          <CirclePlus className="ml-1" color="blue" />
        </button>
      </div>
      {formik.values[fieldName][0]?.titre && (
        <div className="w-full relative flex items-center justify-around">
          <div className="flex items-center justify-between w-full font-bold border rounded-sm pl-3 pr-11 bg-slate-200 dark:bg-slate-600 text-purple dark:text-blue-200">
            <p>{`Option`}</p>
            <p>{`Date obtention`}</p>
          </div>
        </div>
      )}
      {formik.values[fieldName].map((diplome: any, index: number) => (
        <div key={index}>
          {diplome.titre && (
            <div className="w-full relative flex items-center justify-between mb-[-14px]">
              <div className="flex items-center justify-between w-full font-bold border rounded-sm px-3">
                <p>{`${diplome.titre}`}</p>
                <p>{`${diplome.date}`}</p>
              </div>
              <button
                type="button"
                className="col-span-1 p-2 text-white"
                onClick={() => removeDiplome(index)}
              >
                <CircleX color="red" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const MilitaryFields: FormikField = {
  submitBtn: "Ajouter",
  data: [
    {
      label: "Nom",
      name: "firstName",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Prenom",
      name: "lastName",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Date de naissance",
      name: "birthday",
      type: "date",
      autocomplete: "off",
    },
    {
      label: "Lieu de naissance",
      name: "birthPlace",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "CIN",
      name: "cnie",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Adresse",
      name: "adresse",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Telephone",
      name: "phone",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Passport",
      name: "passport",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Permis civil",
      name: "permisCivil",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Permis militaire",
      name: "permisMilitaire",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Groupe sanguin",
      name: "bloodType",
      type: "radio",
      autocomplete: "off",
      options: [
        { label: "O+", value: "O+" },
        { label: "O-", value: "O-" },
        { label: "A+", value: "A+" },
        { label: "A-", value: "A-" },
        { label: "B+", value: "B+" },
        { label: "B-", value: "B-" },
        { label: "AB+", value: "AB+" },
        { label: "AB-", value: "AB-" },
      ],
    },
    {
      label: "Situation familiale",
      name: "familySituation",
      type: "radio",
      autocomplete: "off",
      options: [
        { label: "Marrie", value: "Marrie" },
        { label: "celibataire", value: "Celibataire" },
        { label: "divorce", value: "Divorce" },
        { label: "veuf", value: "Veuf" },
      ],
    },
    {
      label: "Matricule",
      name: "matricule",
      type: "number",
      autocomplete: "off",
    },
    {
      label: "Grade",
      name: "grade",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Matricule BR",
      name: "matriculeBr",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Numero de plaque",
      name: "numPlaqueMle",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Date d'admission",
      name: "dateAdmissionGR",
      type: "date",
      autocomplete: "off",
    },
    {
      label: "Departement",
      name: "departement",
      type: "text",
      autocomplete: "off",
    },
    {
      label: "Photo",
      name: "urlPhoto",
      type: "file",
      autocomplete: "off",
    },
    {
      label: "Diplomes civil",
      name: "diplomesCivil",
      type: "custom",
      autocomplete: "off",
      render: DiplomesFields,
    },
    {
      label: "Diplomes Militaires",
      name: "diplomesMilitaires",
      type: "custom",
      autocomplete: "off",
      render: DiplomesFields,
    },
    {
      label: "Unités et affectations",
      name: "unites_affectations",
      type: "custom",
      autocomplete: "off",
      render: UnitesAffectationField,
    },
  ],
};
export default DiplomesFields;

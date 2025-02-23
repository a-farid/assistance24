"use client";
import { FormikProps } from "formik";
import { CirclePlus, CircleX } from "lucide-react";
import React, { useEffect, useState } from "react";

const UnitesAffectationField = (
  formik: FormikProps<any>,
  fieldName: string
) => {
  const [uniteAffecte, setUniteAffecte] = useState<{
    unite: string;
    dateAffectation: string;
    dateMutation: string;
  }>({
    unite: "",
    dateAffectation: "",
    dateMutation: "",
  });

  const addUniteAffecte = () => {
    const { unite, dateAffectation, dateMutation } = uniteAffecte;
    if (unite && dateAffectation) {
      formik.setFieldValue(fieldName, [
        ...formik.values[fieldName],
        { unite, dateAffectation, dateMutation },
      ]);
      setUniteAffecte({ unite: "", dateAffectation: "", dateMutation: "" });
    }
  };

  const removeuniteAffecte = (index: number) => {
    const updateAffectationduniteAffectes = formik.values[fieldName].filter(
      (_: any, idx: number) => idx !== index
    );
    formik.setFieldValue(fieldName, updateAffectationduniteAffectes);
  };

  useEffect(() => {
    const isFirstuniteAffecteEmpty =
      formik.values[fieldName].length === 2 &&
      !formik.values[fieldName][0]?.unite;
    if (isFirstuniteAffecteEmpty) {
      removeuniteAffecte(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values[fieldName]]);

  return (
    <div className="col-span-2">
      <div className="w-full mb-2 relative">
        <div className="gap-2 w-full grid grid-cols-2">
          <input
            className="p-1 col-span-2"
            type="text"
            placeholder="Unite"
            value={uniteAffecte.unite}
            onChange={(e) =>
              setUniteAffecte({ ...uniteAffecte, unite: e.target.value })
            }
          />
          <div className="col-span-2 flex items-center justify-between">
            <input
              className="p-1"
              type="date"
              placeholder="Date d'affectation"
              value={uniteAffecte.dateAffectation}
              onChange={(e) =>
                setUniteAffecte({
                  ...uniteAffecte,
                  dateAffectation: e.target.value,
                })
              }
            />
            <input
              className="p-1"
              type="date"
              placeholder="Date de mutation"
              value={uniteAffecte.dateMutation}
              onChange={(e) =>
                setUniteAffecte({
                  ...uniteAffecte,
                  dateMutation: e.target.value,
                })
              }
            />
            <button
              type="button"
              className="p-2 bg-blue-500 text-white"
              onClick={addUniteAffecte}
            >
              <CirclePlus className="ml-1" />
            </button>
          </div>
        </div>
      </div>
      {formik.values[fieldName].map((uniteAffecte: any, index: number) => (
        <div key={index}>
          {uniteAffecte.unite && (
            <div className="w-full mb-2 relative flex items-center justify-between">
              <div className="flex gap-2 items-center justify-between w-full font-bold border rounded-sm px-3 bg-gray-200 dark:bg-gray-600">
                <p>{`${uniteAffecte.unite}`}</p>
                <p>{`Le ${uniteAffecte.dateAffectation}`}</p>
                <p>{`Le ${uniteAffecte.dateMutation}`}</p>
              </div>
              <button
                type="button"
                className="col-span-1 p-2 text-white"
                onClick={() => removeuniteAffecte(index)}
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

export default UnitesAffectationField;

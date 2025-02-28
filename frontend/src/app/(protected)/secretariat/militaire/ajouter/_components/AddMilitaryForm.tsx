"use client";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/hooks";
import { useAddMilitaireMutation } from "@/lib/features/secretariat/secApi";
import CustomFormik from "@/components/custom/CustomFormik";
import { MilitaryFields } from "./MilitaryFields";

const diplome = z.object({
  titre: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
});
const uniteAffect = z.object({
  unite: z.string().optional().nullable(),
  dateAffectation: z.string().date().optional().nullable(),
  dateMutation: z.string().date().optional().nullable(),
});
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  firstName: z.string().min(3, "Minimum a 03 lettres").max(255),
  lastName: z.string().min(3, "Minimum a 03 lettres").max(255),
  birthday: z.string().date(),
  birthPlace: z.string().min(3, "Minimum a 03 lettres").max(255),
  cnie: z.string().min(3, "Minimum a 03 lettres").max(10),
  adresse: z.string().min(3, "Minimum a 03 lettres").max(255),
  phone: z.string().refine((value) => {
    return value.length == 12 && value.startsWith("212");
  }, "Le numero de telephone doit commencer par 212 et contenir 12 chiffres"),
  passport: z.string().min(3, "Minimum a 03 lettres").max(20),
  permisCivil: z.string().min(1).max(20),
  permisMilitaire: z.string().min(1).max(20),
  bloodType: z.string().min(1).max(3),
  familySituation: z.string().min(3, "Minumum a 03 lettres").max(20),
  matricule: z.number().min(1).max(99999),
  grade: z.string().min(1).max(20),
  matriculeBr: z.string().min(1).max(20),
  numPlaqueMle: z.string().min(1).max(10),
  dateAdmissionGR: z.string().date(),
  departement: z.string().min(1).max(20),
  urlPhoto: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  diplomesCivil: z.array(diplome).optional().nullable(),
  diplomesMilitaires: z.array(diplome).optional().nullable(),
  unites_affectations: z.array(uniteAffect).optional().nullable(),
});
type FormValues = z.infer<typeof formSchema>;
const initialValues = {
  firstName: "farid",
  lastName: "ahizoune",
  birthday: "2024-07-21",
  birthPlace: "sidi slimane",
  cnie: "gk110570",
  adresse: "rabat",
  phone: "212700000000",
  passport: "aoi123456",
  permisCivil: "B",
  permisMilitaire: "A",
  bloodType: "O+",
  familySituation: "Marrie",
  matricule: 39917,
  grade: "Adjudant",
  matriculeBr: "39917",
  numPlaqueMle: "A3852",
  dateAdmissionGR: "2024-07-21",
  departement: "Administration",
  urlPhoto: null,
  diplomesCivil: [{ titre: "", date: "" }],
  diplomesMilitaires: [{ titre: "", date: "" }],
  unites_affectations: [
    {
      unite: "test",
      dateAffectation: "2020-07-30",
      dateMutation: "2024-07-06",
    },
  ],
};

type Props = {};
function AddMilitaryForm({}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [addMilitaire, { data, error, isSuccess, isLoading }] =
    useAddMilitaireMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data.message || "Militaire added successfully";
      toast.success(message);
      router.push("/");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error, data, router, dispatch]);

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();

      // Append the photo file if it exists
      if (values.urlPhoto instanceof File) {
        formData.append("photo", values.urlPhoto);
      }

      // Transform diplomas data into the desired format
      const diplomes = [
        ...(values.diplomesCivil?.map((diplome) => ({
          typeDiplome: "civil",
          option: diplome.titre,
          dateObt: diplome.date,
        })) || []),
        ...(values.diplomesMilitaires?.map((diplome) => ({
          typeDiplome: "militaire",
          option: diplome.titre,
          dateObt: diplome.date,
        })) || []),
      ];
      diplomes.forEach((value, key, array) => {
        if (value.option == "") {
        }
      });
      const validDiplomes = diplomes.filter(
        (diplome: any) => diplome.option.trim() !== ""
      );
      console.log("validDiplomes", validDiplomes);
      // Convert other values to JSON and append to FormData
      const jsonData = { ...values, diplomes: validDiplomes };
      delete jsonData.urlPhoto;
      delete jsonData.diplomesCivil;
      delete jsonData.diplomesMilitaires;

      formData.append("data", JSON.stringify(jsonData));

      formData.forEach((value, key) => {
        console.log(`${key} is just :`, value);
      });
      const result = await addMilitaire(formData).unwrap();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <CustomFormik
        initialValues={initialValues}
        formSchema={formSchema}
        onSubmit={onSubmit}
        fields={MilitaryFields}
        isLoading={isLoading}
      />
    </div>
  );
}
export default AddMilitaryForm;

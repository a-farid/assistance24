"use client"
import React from 'react'
import { TextField } from "@mui/material";


type Props = {
    label?: string;
    value?: string;
};


const TextFieldData = ({label, value}: Props) => {
  return (
          <div className="grid grid-cols-6 gap-4">
            <p className="text-2xl font-bold col-span-2">{label}</p>
            <p className="font-bold">:</p>
            <p className="text-2xl col-span-3">{value ?? "---"}</p>
          </div>
  )
}

export default TextFieldData
"use client"
import React from 'react'
import { TextField } from "@mui/material";


type Props = {
    label?: string;
    value?: string;
};


const TextFieldData = ({label, value}: Props) => {
  return (
          <div className="grid grid-cols-4 gap-4">
            <p className="text-2xl font-bold">{label}</p>
            <p className="font-bold">:</p>
            <p className="text-2xl col-span-2">{value ?? "---"}</p>
            </div>
  )
}

export default TextFieldData
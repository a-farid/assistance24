"use client"
import React from 'react'
import { TextField } from "@mui/material";


type Props = {
    label?: string;
    value?: string;
};


const TextFieldData = ({label, value}: Props) => {
  return (
          <div className="grid grid-cols-3 gap-4">
            <p className="text-3xl font-bold">{label}</p>
                <TextField className="col-span-2"
                id="outlined-read-only-input"
                label={label}
                defaultValue={value ?? "---"}
                variant="outlined"
                slotProps={{input: {readOnly: true}}}
              />
            </div>
  )
}

export default TextFieldData
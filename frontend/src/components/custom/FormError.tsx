import React from "react";


function FormError(props: any) {
  return (
    <>
      <div
        className="w-0 h-0 ml-5
  border-l-[10px] border-l-transparent
  border-b-[15px] border-b-red-700
  border-r-[10px] border-r-transparent"
      ></div>
      <div className="text-red-700 w-full bg-red-100 rounded-md border-2 border-red-700">
        {React.Children.map(props.children, (child, i) => {
          return (
            <div key={i} className="m-1 p-1 ">
              {child}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default FormError;

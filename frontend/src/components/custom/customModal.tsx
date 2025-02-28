import React from "react";
import { Box, Modal } from "@mui/material";

type Props = {
  openCustomModal: boolean;
  setOpenCustomModal: (open: boolean) => void;
  component: any;
  setRoute?: (route: string) => void;
  user?: any;
};

const CustomModal = ({
  openCustomModal,
  setOpenCustomModal,
  setRoute,
  component: Component,
  user,
}: Props) => {
  return (
    <>
      <Modal
        open={openCustomModal}
        onClose={() => setOpenCustomModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="absolute top-[25%] left-[50%] -translate-x-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-md shadow p-4 outline-none">
          <Component
            setOpenCustomModal={setOpenCustomModal}
            setRoute={setRoute}
            user={user}
          />
        </Box>
      </Modal>
    </>
  );
};

export default CustomModal;

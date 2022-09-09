import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { activeModalNameState } from "../../store/store";
import { useRecoilState } from "recoil";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  modalName,
  ModalComponent,
}: {
  modalName: string;
  ModalComponent: React.FC;
}) {
  const [activeModalName, setActiveModalName] = useRecoilState(activeModalNameState);
  return (
    <div>
      <Modal
        open={activeModalName === modalName}
        onClose={() => setActiveModalName("")}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <Box sx={style}>
            <ModalComponent />
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </div>
      </Modal>
    </div>
  );
}

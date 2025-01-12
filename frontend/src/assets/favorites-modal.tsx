import { Box, Modal } from "@mui/material";

type FavoritesModalProps = {
  open: boolean;
  onClose: () => void;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const FavoritesModal = (props: FavoritesModalProps) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box sx={style}>
        <h1>hello world</h1>
      </Box>
    </Modal>
  );
};

export default FavoritesModal;

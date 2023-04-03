import { Modal } from "antd";

const OpenModal = (props) => {
  const { open, close, title, text, func } = props;

  return (
    <Modal title={title} open={open} centered okText="확인" cancelText="취소" onOk={() => func()} onCancel={close}>
      <p>{text}</p>
    </Modal>
  );
};
export default OpenModal;

import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { BiPhone, BiUser } from "react-icons/bi";

export const fields = [
  {
    id: 0,
    placeholder: "First Name",
    type: "text",
    key: 0,
    isEditable: true,
    errorKey: "firstName",
    value: "FirstName",
  },
  {
    id: 1,
    placeholder: "Last Name",
    type: "text",
    key: 0,
    isEditable: true,
    errorKey: "lastName",
    value: "LastName",
  },
  {
    id: 2,
    placeholder: "00 11 22 33 44 5567",
    type: "number",
    key: 1,
    isEditable: false,
    errorKey: "",
    value: "Phone",
  },
  {
    id: 3,
    placeholder: "Email",
    type: "email",
    key: 2,
    isEditable: false,
    errorKey: "",
    value: "Email",
  },
  {
    id: 4,
    placeholder: "Existing password",
    type: "password",
    key: 3,
    isEditable: true,
    errorKey: "currentPassword",
  },
  {
    id: 5,
    placeholder: "New password",
    type: "password",
    key: 3,
    isEditable: true,
    errorKey: "newPassword",
  },
  {
    id: 6,
    placeholder: "Confirm New password",
    type: "password",
    key: 3,
    isEditable: true,
    errorKey: "confirmNewPassword",
  },
];

export const icons = [
  <BiUser />,
  <BiPhone />,
  <AiOutlineMail />,
  <AiOutlineLock />,
];

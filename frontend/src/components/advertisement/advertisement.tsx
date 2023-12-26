import { Box } from "@mui/material";

import style from "./advertisement.module.css";

export default function Advertisement({
  title,
  address,
  description,
  owner,
}: {
  title: string;
  address: string;
  description: string;
  owner: string;
}) {
  return (
    <Box
      sx={{
        borderRadius: "12px",
        boxShadow: "-1px 1px 10px 0px rgba(0, 0, 0, 0.15)",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        minWidth: "300px",
        gap: "20px",
        padding: "40px",
      }}
    >
      <p className={style.mainTitle}>{title}</p>
      <p className={style.titles}>Адрес</p>
      <p>{address}</p>
      <p className={style.titles}>Описание</p>
      <p>{description}</p>
      <p className={style.titles}>Владелец</p>
      <p>{owner}</p>
    </Box>
  );
}

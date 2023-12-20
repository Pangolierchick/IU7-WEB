"use client";
import { Box, Button, TextField } from "@mui/material";

export default function Signup() {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        position: "absolute",
        top: "50%",
        left: "50%",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "12px",
        boxShadow: "-1px 1px 10px 0px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: 4,
          gap: 2,
        }}
      >
        <TextField label="Логин"></TextField>
        <TextField label="Пароль" type="password"></TextField>
        <TextField label="Подтверждение пароля" type="password"></TextField>
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ backgroundColor: "#116a7b", borderRadius: "12px" }}
        >
          Отправить
        </Button>
      </Box>
    </Box>
  );
}

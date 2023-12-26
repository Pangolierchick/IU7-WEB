"use client";
import { signup } from "@/services/user";
import { Alert, AlertTitle, Box, Button, TextField } from "@mui/material";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAllert, setShowAllert] = useState("");
  const router = useRouter();

  const clearInputs = () => {
    setLogin("");
    setPassword("");
    setConfirmPassword("");
  };

  const validateInput = () => {
    if (Math.min(login.length, password.length, confirmPassword.length) === 0) {
      return "Введены некорректные данные";
    }

    if (password !== confirmPassword) {
      return "Пароли не совпадают, повторите попытку";
    }

    return null;
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valErr = validateInput();

    if (valErr) {
      clearInputs();
      setShowAllert(valErr);
      return;
    }

    signup(login, password).then(
      (v) => {
        router.push("/");
      },
      (e) => {
        if (isAxiosError(e)) {
          if (e.response) {
            if (e.response.status === 400) {
              setShowAllert("Введены некорректные данные");
            } else if (e.status === 500) {
              setShowAllert("Ошибка сервера, повторите попытку позже");
            }
          } else {
            setShowAllert("Ошибка сервера, повторите попытку позже");
          }
        }
      }
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "-1px 1px 10px 0px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSignup}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: 4,
          gap: 2,
        }}
      >
        <TextField
          required
          label="Логин"
          onChange={(e) => setLogin(e.target.value)}
        ></TextField>
        <TextField
          required
          label="Пароль"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></TextField>
        <TextField
          required
          label="Подтверждение пароля"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></TextField>
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ backgroundColor: "#116a7b", borderRadius: "12px" }}
        >
          Отправить
        </Button>

        <Alert
          severity="error"
          sx={{ display: showAllert !== "" ? "" : "none" }}
        >
          <AlertTitle>Ошибка</AlertTitle>
          {showAllert}
        </Alert>
      </Box>
    </Box>
  );
}

"use client";
import { auth } from "@/services/auth";
import { Alert, AlertTitle, Box, Button, TextField } from "@mui/material";
import { isAxiosError } from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import PageContext from "../context";

export default function Login() {
  const navContext = useContext(PageContext);
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showAllert, setShowAllert] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    auth(login, password)
      .then((data) => {
        const [id, token] = data;
        setCookie("token", token, { secure: true });
        setCookie("id", id);

        if (navContext) {
          navContext(true);
        }

        router.push("/");
      })
      .catch((e) => {
        if (isAxiosError(e)) {
          if (e.response) {
            if (e.response.status === 400) {
              setShowAllert("Введен неправильный логин или пароль");
            }
          } else {
            setShowAllert("Ошибка сервера, повторите позже");
          }
        }
      });
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
        onSubmit={handleLogin}
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
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ borderRadius: "12px" }}
        >
          Отправить
        </Button>

        <Alert
          severity="error"
          sx={{ display: showAllert === "" ? "none" : "" }}
        >
          <AlertTitle>Ошибка</AlertTitle>
          {showAllert}
        </Alert>
      </Box>
    </Box>
  );
}
